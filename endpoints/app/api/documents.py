from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse

from app.services.documents import DocumentLibrary, DocumentNotFoundError


router = APIRouter(prefix="/api/v1/documents", tags=["documents"])


@router.get("")
async def list_documents(request: Request) -> list[dict[str, str]]:
    library: DocumentLibrary = request.app.state.document_library
    return library.list_documents()


@router.get("/{document_id}", response_class=HTMLResponse)
async def view_document(document_id: str, request: Request) -> HTMLResponse:
    library: DocumentLibrary = request.app.state.document_library
    try:
        return HTMLResponse(library.render(document_id))
    except DocumentNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Document not found") from exc
