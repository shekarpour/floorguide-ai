from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.agents.workflow import FloorGuideWorkflow
from app.api.ask import router as ask_router
from app.api.documents import router as documents_router
from app.config import Settings
from app.schemas import HealthResponse
from app.services.documents import DocumentLibrary


logger = logging.getLogger("floorguide.cors")


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved = settings or Settings.from_env()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.workflow = FloorGuideWorkflow(resolved)
        app.state.document_library = DocumentLibrary(resolved.data_dir)
        yield

    app = FastAPI(
        title="FloorGuide AI API",
        version="0.1.0",
        description="Routes manufacturing questions to grounded source tools and returns verified answers.",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(resolved.allowed_origins),
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type"],
    )

    @app.middleware("http")
    async def log_preflight_origin(request: Request, call_next):
        if request.method == "OPTIONS":
            logger.info(
                "CORS preflight origin=%s requested_method=%s requested_headers=%s",
                request.headers.get("origin", "<missing>"),
                request.headers.get("access-control-request-method", "<missing>"),
                request.headers.get("access-control-request-headers", "<missing>"),
            )
        return await call_next(request)

    app.include_router(ask_router)
    app.include_router(documents_router)

    @app.get("/health", response_model=HealthResponse, tags=["health"])
    async def health() -> HealthResponse:
        return HealthResponse(model=resolved.gemini_model, mock_mode=resolved.use_mock_ai)

    return app


app = create_app()
