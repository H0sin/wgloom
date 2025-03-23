from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
import config
from app import logger
from app.db import crud
from app.db.base import get_db
from app.db.crud import create_interface, get_interface_by_name
from app.schemas.interface import InterfaceCreated, InterfaceCreate, InterfaceStatus, Interface, InterfaceResponse
from app.schemas.ip_address import InterfaceIps
from app.utils import responses
from app.utils.interface import add_interface_file, interface_status, delete_interface_file

router = APIRouter(tags=["Admin"], prefix="/api", responses={401: responses._401})


@router.post('/interface', response_model=InterfaceCreated,
             responses={403: responses._403, 409: responses._409})
async def add_interface(interface: InterfaceCreate, db: AsyncSession = Depends(get_db)):
    try:
        file_created = await add_interface_file(interface, config.INTERFACE_DIRECTORY)

        if not file_created:
            raise HTTPException(status_code=500, detail='when save file occurred error')

        dbinterface = await create_interface(db, interface)

    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="interface ready exist")

    logger.info(f'New interface "{interface.name}" added')
    return dbinterface


@router.patch('/interface/status',
              responses={403: responses._403, 409: responses._409})
async def update_interface_status(name: str, status: InterfaceStatus, db: AsyncSession = Depends(get_db)):
    try:
        message, response = await interface_status(status, name)
        if response:
            await crud.update_interface_status(db, name, status)
            return {"update interface": "success", "out": message}
        else:
            return {"not update interface status"}
    except Exception:
        return {"when update interface occurred error"}


@router.get('/interface', response_model=List[InterfaceResponse])
async def get_interfaces(db: AsyncSession = Depends(get_db)):
    return await crud.get_interfaces(db)


@router.delete('/interface/{name}', response_model=InterfaceResponse)
async def delete_interface(name: str, db: AsyncSession = Depends(get_db)):
    interface: Interface = await get_interface_by_name(db, name)

    if interface:
        result = await delete_interface_file(interface.name)

        if result:
            return await crud.delete_interface(db, interface)

        else:
            return {'error': "when delete interface file occurred error"}

    return {'error': "not found interface"}


@router.get('/interfaces/{name}/ips', response_model=InterfaceIps, responses={404: responses._404})
async def get_interface_ips(name: str, db: AsyncSession = Depends(get_db)):
    data = await crud.get_interface_ips(db, name)
    if not data:
        raise HTTPException(status_code=404, detail="Interface not found")
    return data
