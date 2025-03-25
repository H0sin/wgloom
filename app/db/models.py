import secrets
from email.policy import default

from sqlalchemy import Column, Integer, String, Boolean, Text, Float, Enum, ForeignKey, BIGINT, text
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
    listen_port = Column(Integer, unique=True, default="")
    private_key = Column(String, unique=True, nullable=True)
    ip_address = Column(String, unique=True, nullable=True)
    public_key = Column(String, unique=True, nullable=True)
    status = Column(Enum(InterfaceStatus), default=InterfaceStatus.disabled)
    upload_percent = Column(Float, default=1.0)
    download_percent = Column(Float, default=1.0)

    peers = relationship("Peer", back_populates="interface", cascade="all, delete-orphan")
    ip_addresses = relationship("IpAddress", back_populates="interface", cascade="all, delete-orphan")


class Peer(Base):
    __tablename__ = 'peers'
    name = Column(String(512), unique=True, index=True)
    public_key = Column(String(512), unique=True)
    private_key = Column(String(512), unique=True)
    pre_shared_key = Column(String(512), unique=True)
    # allowedIPs = Column(INET)
    # addresses = Column(ARRAY(String))
    dns = Column(String(50))
    mtu = Column(Integer)
    persistent_keep_alive = Column(Integer)
    status = Column(Enum(UserStatus), nullable=False, default=UserStatus.active)
    note = Column(Text)
    total_volume = Column(BIGINT)
    expire_time = Column(BIGINT)
    upload_volume = Column(BIGINT(), default=0)
    # start_time = Column(BIGINT)
    last_total_received_volume = Column(BIGINT(), default=0)
    last_download_volume = Column(BIGINT(), default=0)
    last_upload_volume = Column(BIGINT(), default=0)
    on_hold_expire_duration = Column(BIGINT())
    token = Column(String(64), unique=True)
    end_point_allowed_ips = (Column(ARRAY(String), default="[0.0.0.0]"))

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
