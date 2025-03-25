from typing import List, Optional
from pydantic import BaseModel, Field

from app.schemas.ip_address import IpAddress
from app.schemas.user import UserStatus


class PeerCreate(BaseModel):
    name: Optional[str]
    public_key: Optional[str]
    private_key: Optional[str]
    pre_shared_key: Optional[str]
    allowedIPs: Optional[list[str]]
    dns: Optional[str] = None
    mtu: Optional[int] = Field(1420)
    persistent_keep_alive: Optional[int] = 21
    status: UserStatus = UserStatus.active
    note: Optional[str] = None
    bulk: bool = True
    count: int = Field(1)
    expire_time: int = Field(default=0)
    total_volume: int = Field(default=0)
    on_hold_expire_duration: int
    end_point_allowed_ips: Optional[list[str]]


class PeerResponse(BaseModel):
    name: str
    public_key: str
    private_key: str
    pre_shared_key: str
    ip_addresses: list[IpAddress]
    dns: Optional[str] = None
    mtu: Optional[int]
    persistent_keep_alive: Optional[int] = 21
    status: UserStatus = UserStatus.active
    note: Optional[str] = None
    bulk: bool = True
    count: int = Field(1)
    end_point_allowed_ips: list[str]
    expire_time: Optional[int] = Field(default=0)
    total_volume: Optional[int] = Field(default=0)
    on_hold_expire_duration: Optional[int]
    token: str

    class Config:
        from_attributes = True
        populate_by_name = True
