from typing import List
from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import crud
from app.db.base import get_db
from app.db.crud import get_interface_by_name
from app.db.models import Interface
from app.schemas.peer import PeerCreate, PeerResponse
from app.templates import render_template
from app.utils import responses
from app.utils.responses import NotFound
from config import SUBSCRIPTION_PAGE_TEMPLATE

router = APIRouter(tags=['peer'], prefix="/api", responses={401: responses._401})


@router.post('/peer/{interface_name}', response_model=List[PeerResponse],
             responses={404: responses._404, 403: responses._403, 409: responses._409})
async def add_peer(interface_name: str, peer: PeerCreate, db: AsyncSession = Depends(get_db)):
    interface: Interface = await get_interface_by_name(db, interface_name)

    if not interface:
        raise NotFound

    return await crud.add_peer(db, peer, interface)

