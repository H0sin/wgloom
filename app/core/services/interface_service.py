from typing import List

from sqlalchemy import update

import config
from app.core.repositories.base import BaseRepository
from app.db.models import Interface
from app.schemas import interface
from app.schemas.interface import InterfaceCreate, InterfaceStatus
from app.utils.interface import add_interface_file,interface_status


class InterfaceService:
    def __init__(self, db_session):
        self.repository = BaseRepository(Interface, db_session)
        self.db_session = db_session

    async def create_interface(self, interface_in: InterfaceCreate) -> Interface:
        new_interface : Interface = await self.repository.create(interface_in)

        file_created = await add_interface_file(interface_in, config.INTERFACE_DIRECTORY)

        if not file_created:
            raise ValueError("Insert prevented because the file creation failed.")

        return new_interface

    async def change_interface_status(self, name: str,status : InterfaceStatus):
        response,message = await interface_status(status,name)

        if response :
            stmt = (
                update(Interface)
                .where(Interface.name == name)
                .values(status=status)
                .returning(Interface)
            )
            result = await self.db_session.execute(stmt)
            await self.db_session.commit()
            return result.fetchone()

    async def get_interfaces(self) -> List[Interface]:
        return await self.repository.list()