import base64
import nacl.utils
from nacl.public import PrivateKey
from dataclasses import dataclass


@dataclass
class KeyPair:
    private_key: str
    public_key: str
    pre_shared_key: str


def generate_keys() -> KeyPair:
    # Generate a new private key using PyNaCl
    private_key_obj = PrivateKey.generate()

    # Retrieve the private and public keys as bytes
    private_key_bytes = bytes(private_key_obj)
    public_key_bytes = bytes(private_key_obj.public_key)

    pre_shared_key_bytes = nacl.utils.random(32)

    # Convert the bytes to Base64 encoded strings for easy representation
    private_key_b64 = base64.b64encode(private_key_bytes).decode('utf-8')
    public_key_b64 = base64.b64encode(public_key_bytes).decode('utf-8')
    pre_shared_key_b64 = base64.b64encode(pre_shared_key_bytes).decode('utf-8')

    return KeyPair(
        private_key=private_key_b64,
        public_key=public_key_b64,
        pre_shared_key=pre_shared_key_b64
    )
