from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field
from sqlalchemy import false

class InterfaceStatus(str, Enum):
    active = "active"
    disabled = "disabled"


class Interface(BaseModel):
    name: str
    address: Optional[str] = None
    endpoint: Optional[str] = None
    save_config: bool = false
    pre_up: str
    post_up: str
    pre_down: str
    post_down: str
    listen_port: Optional[int] = None
    private_key: Optional[str] = None
    ip_address: Optional[str] = None
    public_key: Optional[str] = None
    upload_percent: float = 1.0
    download_percent: float = 1.0


class InterfaceCreate(BaseModel):
    name: str = Field(..., description="interface name uniq", title="interface")
    address: str = Field(..., description="Interface address")
    endpoint: str = Field(..., description="Endpoint address")
    save_config: bool = Field(False, description="Save configuration flag")
    pre_up: str = Field("", description="Command to run before up")
    post_up: str = Field("", description="Command to run after up")
    pre_down: str = Field("", description="Command to run before down")
    post_down: str = Field("", description="Command to run after down")
    listen_port: int = Field(..., description="Listening port")
    private_key: str = Field(..., description="Private key")
    ip_address: str = Field(..., description="IP address")
    public_key: str = Field(..., description="Public key")
    upload_percent: float = Field(1.0, description="Upload percent")
    download_percent: float = Field(1.0, description="Download percent")

class InterfaceCreated(BaseModel):
    name: Optional[str] = None
    address: str
    endpoint: str
    save_config: bool
    pre_up: str
    post_up: str
    pre_down: str
    post_down: str
    listen_port: int
    private_key: str
    ip_address: str
    public_key: str
    upload_percent: float
    download_percent: float


class InterfaceResponse(BaseModel):
    id : int
    name: Optional[str] = None
    address: str
    endpoint: str
    save_config: bool
    pre_up: str
    post_up: str
    pre_down: str
    post_down: str
    listen_port: int
    private_key: str
    ip_address: str
    public_key: str
    upload_percent: float
    download_percent: float
