import textwrap

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import HTMLResponse

from app.db.base import get_db
from app.db.crud import get_peer_by_private_key, get_peer_by_token
from app.db.models import Peer, Interface
from app.templates import render_template
from app.utils.responses import NotFound, HTTPException
from config import WG_SUBSCRIPTION_PATH, SUBSCRIPTION_PAGE_TEMPLATE

router = APIRouter(tags=['config'], prefix=f'/{WG_SUBSCRIPTION_PATH}')


@router.get('/{token}', include_in_schema=False)
async def peer_config(token: str, db: AsyncSession = Depends(get_db)):
    peer: Peer = await get_peer_by_token(db, token)

    interface = peer.interface
    ips: list[str] = []

    for ipaddress in peer.ip_addresses:
        ips.append(ipaddress.ip)

    qr_content = textwrap.dedent(f"""
        [Interface]
        PrivateKey = {peer.private_key}
        Address = {','.join(ips)}
        DNS = {peer.dns}
        MTU = {peer.mtu}
        
        [Peer]
        PublicKey = {interface.public_key}
        AllowedIPs = {','.join(list(peer.end_point_allowed_ips))}
        Endpoint = {interface.endpoint}:{interface.listen_port}
        PersistentKeepalive = {peer.persistent_keep_alive}
    """).strip()

    return HTMLResponse(
        render_template(
            SUBSCRIPTION_PAGE_TEMPLATE,
            {'peer': peer, 'qr_content': qr_content}
        )
    )
