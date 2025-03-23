from typing import List, Optional

from pydantic import BaseModel

from app.schemas.user import UserStatus


class PeerCreate(BaseModel):
    name: str
    public_key: Optional[str]
    private_key: Optional[str]
    pre_shared_key: Optional[str]
    allowedIPs: Optional[list[str]]
    dns: Optional[str] = None
    mut: Optional[int] = None
    persistent_keep_alive: Optional[int] = None
    status: UserStatus = UserStatus.active
    note: Optional[str] = None