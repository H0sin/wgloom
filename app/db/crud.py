from typing import Optional, List, Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session, selectinload
from app.db.models import Interface, IpAddress, Peer
from app.schemas.interface import InterfaceCreate, InterfaceStatus
from app.schemas.ip_address import InterfaceIps, IPWithAssign
from app.schemas.peer import PeerCreate
from app.schemas.user import UserStatus
from app.utils.iprange_utility import IpRangeUtility
from app.utils.key_pair import KeyPair, generate_keys
from app.utils.peer import create_peer


async def get_interface_by_name(db: AsyncSession, name: str) -> Optional[Interface]:
    query = select(Interface).filter_by(name=name)
    result = await db.execute(query)
    return result.scalars().first()


async def create_interface(db: AsyncSession, interface_in: InterfaceCreate) -> Interface:
    interface = Interface(
        name=interface_in.name,
        address=interface_in.address,
        endpoint=interface_in.endpoint,
        save_config=interface_in.save_config,
        pre_up=interface_in.pre_up,
        post_up=interface_in.post_up,
        pre_down=interface_in.pre_down,
        post_down=interface_in.post_down,
        listen_port=interface_in.listen_port,
        private_key=interface_in.private_key,
        ip_address=interface_in.ip_address,
        public_key=interface_in.public_key,
        upload_percent=interface_in.upload_percent,
        download_percent=interface_in.download_percent
    )

    ip_list = IpRangeUtility(interface_in.ip_address).get_all_ips()
    filtered_ips = [ip for ip in ip_list if ip != interface_in.ip_address]
    interface.ip_addresses = [IpAddress(ip=ip) for ip in filtered_ips]

    db.add(interface)
    await db.commit()
    await db.refresh(interface)
    return interface


async def update_interface_status(db: AsyncSession, name: str, status: InterfaceStatus) -> Interface:
    interface: Interface = await get_interface_by_name(db, name)

    if not interface:
        raise ValueError('not found interface by name')

    interface.status = status

    await db.commit()
    await db.refresh(interface)

    return interface


async def delete_interface(db: AsyncSession, interface: Interface) -> Interface:
    await db.delete(interface)
    await db.commit()
    return interface


async def get_interfaces(db: AsyncSession) -> Sequence[Interface]:
    query = select(Interface)
    result = await db.execute(query)
    return result.scalars().all()


async def create_ip_list(db: AsyncSession, ip_addresses: List[IpAddress]) -> None:
    db.add_all(ip_addresses)
    await db.commit()


async def get_interface_ips(db: AsyncSession, name: str) -> Optional[InterfaceIps]:
    query = (
        select(Interface)
        .where(Interface.name == name)
        .options(selectinload(Interface.ip_addresses))
    )
    result = await db.execute(query)
    interface = result.scalars().first()

    if not interface:
        return None

    ip_list_out = []
    for ip_obj in interface.ip_addresses:
        is_assigned = ip_obj.peer_id is not None
        ip_list_out.append(
            IPWithAssign(ip=ip_obj.ip, is_assigned=is_assigned)
        )

    return InterfaceIps(
        name=interface.name,
        ip_addresses=ip_list_out
    )


async def add_peer(db: AsyncSession, peer: PeerCreate, interface: Interface):
    if len(peer.allowedIPs) == 0:
        result = await db.scalars(
            select(IpAddress).where(IpAddress.peer_id == None)
        )
        ip_record = result.first()
        if ip_record:
            print("Found IP address with no peer:", ip_record.ip)
        else:
            raise ValueError("Not found IP address empty")
    else:
        # If allowedIPs is not empty, ensure none of these IPs belong to another peer
        ips = peer.allowedIPs  # list of IP strings
        # Find all IpAddress rows that match any of the IPs in the list
        # and already have a peer assigned (peer_id != None).
        result = await db.scalars(
            select(IpAddress).where(
                IpAddress.ip.in_(ips),
                IpAddress.peer_id != None
            )
        )

        used_ips = result.all()

        if used_ips:
            # Means at least one IP in the list is used by another peer
            raise ValueError("One or more IP addresses are already assigned to another peer.")
        else:
            print("All IP addresses in allowedIPs are free to use.")

        # Generate keys if needed
    if not peer.private_key or not peer.public_key:
        keys = generate_keys()
        peer.private_key = keys.private_key
        peer.public_key = keys.public_key

    new_peer = Peer(
        name=peer.name,
        public_key=peer.public_key,
        private_key=peer.private_key,
        pre_shared_key=peer.pre_shared_key,
        addresses=peer.allowedIPs,  # Storing as an ARRAY(String) if desired
        dns=peer.dns,
        mut=peer.mut,
        persistent_keep_alive=peer.persistent_keep_alive,
        note=peer.note,
        interface_id=interface.id,  # or interface_id=peer.interface_id
        status=peer.status  # Or any other logic for status
    )

    db.add(new_peer)
    await db.commit()
    await db.refresh(interface)

    success = await create_peer(new_peer, interface)
    print("CreatePeer result:", success)

    print("ip address is not empty")
