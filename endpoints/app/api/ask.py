from fastapi import APIRouter, Request

from app.schemas import AskRequest, AskResponse

router = APIRouter(prefix="/api/v1", tags=["answers"])


@router.post("/ask", response_model=AskResponse)
async def ask_question(payload: AskRequest, request: Request) -> AskResponse:
    return await request.app.state.workflow.run(payload)

