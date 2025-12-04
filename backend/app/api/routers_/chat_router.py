from fastapi import APIRouter
from app.api.schemas_.chat_Schema import Mensaje
from app.api.services_.chat_Services import procesar_pregunta

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/")
async def chat(request: Mensaje):
    return await procesar_pregunta(request.mensaje)