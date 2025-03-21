from typing import List

from sqlalchemy import update

import config
from app.core.repositories.base import BaseRepository
from app.db.models import Interface, IpAddress
from app.schemas import interface
from app.schemas.interface import InterfaceCreate, InterfaceStatus
from app.utils.interface import add_interface_file, interface_status, delete_interface_file
from app.utils.iprange_utility import IpRangeUtility


class InterfaceService:
    def __init__(self, db_session):
        self.repository = BaseRepository(Interface, db_session)
        self.db_session = db_session

    async def create_interface(self, interface_in: InterfaceCreate) -> Interface:
        file_created = await add_interface_file(interface_in, config.INTERFACE_DIRECTORY)

        if not file_created:
            raise ValueError("Insert prevented because the file creation failed.")

        new_interface: Interface = await self.repository.create(interface_in)
        ip_list: list[str] = IpRangeUtility(new_interface.ip_address).get_all_ips()

        for ip in ip_list[1:]:
            ip_obj = IpAddress(ip=ip, interface_id=new_interface.id)
            new_interface.ip_addresses.append(ip_obj)

        return new_interface

    async def change_interface_status(self, name: str, status: InterfaceStatus):
        response, message = await interface_status(status, name)

        if response:
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

    async def delete_interface(self, name: str) -> bool:
        interface: Interface = await self.repository.single_filters(name=name)

        if interface is None:
            raise ValueError('not found interface')

        await self.change_interface_status(name, InterfaceStatus.disabled)
        result = await delete_interface_file(interface.name)
        if result:
            return await self.repository.delete(interface.id)

        return False
