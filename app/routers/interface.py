from fastapi import APIRouter, Depends

from app.core.services.interface_service import InterfaceService
from app.db.base import get_db
from app.schemas.interface import InterfaceCreated, InterfaceCreate, InterfaceStatus
from app.utils import responses

router = APIRouter(tags=["Admin"], prefix="/api", responses={401: responses._401})


def get_interface_service(db=Depends(get_db)):
    return InterfaceService(db)


@router.post('/interface', response_model=InterfaceCreated, responses={403: responses._403, 409: responses._409})
async def create_interface(interface: InterfaceCreate, service: InterfaceService = Depends(get_interface_service)):
    await service.create_interface(interface)
    return {"name": interface.name}


@router.patch('/interface/status',
              responses={403: responses._403, 409: responses._409})
async def interface_status(name: str, status: InterfaceStatus,
                           service: InterfaceService = Depends(get_interface_service)):
    await service.change_interface_status(name,status)
    return {"ok":"ok"}

