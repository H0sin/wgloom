from fastapi import APIRouter
from . import interface, peer, config

api_router = APIRouter()

routers = [
    interface.router,
    peer.router,
    config.router
]

for router in routers:
    api_router.include_router(router)

__all__ = ["api_router"]
