from email.policy import default

from sqlalchemy import Column, Integer, String, Boolean, Text, Float, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import INET, ARRAY
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.schemas.interface import InterfaceStatus
from app.schemas.user import UserStatus


class User(Base):
    __tablename__ = 'users'
    user_name = Column(String(34), index=True)
    email = Column(String(70), unique=True, index=True)
    hashed_password = Column(String(128))
    is_active = Column(Boolean, default=True)


class Interface(Base):
    __tablename__ = 'interfaces'
    name = Column(String(34), unique=True, index=True)
    address = Column(String, nullable=True)
    endpoint = Column(String, nullable=True)
    save_config = Column(Boolean, default=False)
    pre_up = Column(String, default="")
    post_up = Column(String, default="")
    pre_down = Column(String, default="")
    post_down = Column(String, default="")
    listen_port = Column(Integer, default="")
    private_key = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    public_key = Column(String, nullable=True)
    status = Column(Enum(InterfaceStatus), default=InterfaceStatus.disabled)
    upload_percent = Column(Float, default=1.0)
    download_percent = Column(Float, default=1.0)

    peers = relationship("Peer", back_populates="interface", cascade="all, delete-orphan")
    ip_addresses = relationship("IpAddress", back_populates="interface", cascade="all, delete-orphan")


class Peer(Base):
    __tablename__ = 'peers'
    name = Column(String(34), unique=True, index=True)
    public_key = Column(String(512))
    private_key = Column(String(512))
    pre_shared_key = Column(String(512))
    allowedIPs = Column(INET)
    addresses = Column(ARRAY(String))
    dns = Column(String(50))
    mut = Column(Integer)
    persistent_keep_alive = Column(Integer)
    status = Column(Enum(UserStatus), nullable=False, default=UserStatus.active)
    note = Column(Text)

    interface_id = Column(Integer, ForeignKey('interfaces.id'))
    interface = relationship("Interface", back_populates="peers")

    ip_addresses = relationship("IpAddress", back_populates="peer", cascade="all, delete-orphan")


class IpAddress(Base):
    __tablename__ = "ip_addresses"

    ip = Column(String(17), unique=True)

    interface_id = Column(Integer, ForeignKey('interfaces.id'), nullable=True)
    peer_id = Column(Integer, ForeignKey('peers.id'), nullable=True)

    interface = relationship("Interface", back_populates="ip_addresses")
    peer = relationship("Peer", back_populates="ip_addresses")
