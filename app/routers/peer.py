from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import crud
from app.db.base import get_db
from app.db.crud import get_interface_by_name
from app.db.models import Interface
from app.schemas.interface import InterfaceCreated
from app.schemas.peer import PeerCreate
from app.utils import responses
from app.utils.responses import HTTPException, NotFound

router = APIRouter(tags=['peer'], prefix="/api", responses={401: responses._401})


@router.post('/peer/{interface_name}', response_model=InterfaceCreated,
             responses={404: responses._404, 403: responses._403, 409: responses._409})
async def add_peer(interface_name: str, peer: PeerCreate, db: AsyncSession = Depends(get_db)):
    interface: Interface = await get_interface_by_name(db, interface_name)

    if not interface:
        raise NotFound(detail="interface not found")

    await crud.add_peer(db, peer, interface)

    return {"ok"}
