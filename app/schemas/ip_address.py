from typing import List

from pydantic import BaseModel


class IPWithAssign(BaseModel):
    ip: str
    is_assigned: bool = False

class InterfaceIps(BaseModel):
    name: str
    ip_addresses: List[IPWithAssign]

    class Config:
        from_attributes = True

class IpAddress(BaseModel):
    ip : str