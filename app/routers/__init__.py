from fastapi import APIRouter
from . import interface, peer

api_router = APIRouter()

routers = [
    interface.router,
    peer.router
]

for router in routers:
    api_router.include_router(router)

__all__ = ["api_router"]
