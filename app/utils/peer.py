import asyncio
import subprocess
from typing import List

from app.db.models import Peer, Interface


async def save(interface_name: str) -> bool:
    """
    Equivalent to the C# Save method:
    Calls 'wg-quick save <interface_name>' asynchronously
    and prints any output or errors.
    Returns True on success, False if an exception occurs.
    """
    cmd = ["wg-quick", "save", interface_name]
    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = await process.communicate()

        output = stdout.decode().strip()
        error_output = stderr.decode().strip()

        if output:
            print("Output:", output)
        else:
            print("No output received from wg show command.")

        if error_output:
            print("Error Output:", error_output)

        # Check the process exit code
        if process.returncode != 0:
            print(f"'wg-quick save' exited with code {process.returncode}")
            return False

        return True
    except Exception as e:
        print("An error occurred in save():", e)
        return False

async def create_peer(peer: Peer, interface: Interface) -> bool:
    """
    Equivalent to the C# CreatePeer method:
    Calls 'wg set <interface.Name> peer <peer.PublicKey> allowed-ips <peer.AllowedIPs>',
    reads output, then calls save(interface.Name).
    Returns True if successful, False otherwise.
    """
    # Print the command for debugging
    print(f"set {interface.name} peer {peer.public_key} allowed-ips {','.join(peer.ip_addresses)}")

    cmd = [
        "wg",
        "set",
        interface.name,
        "peer",
        peer.public_key,
        "allowed-ips",
        ",".join(peer.ip_addresses)
    ]
    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = await process.communicate()

        output = stdout.decode().strip()
        error_output = stderr.decode().strip()

        if output:
            print("Output:", output)
        else:
            print("No output received from wg show command.")

        if error_output:
            print("Error Output:", error_output)

        # Check the process exit code
        if process.returncode != 0:
            print(f"'wg set' exited with code {process.returncode}")
            return False

        # Call save() to persist changes
        saved = await save(interface.name)
        return saved
    except Exception as e:
        print("An error occurred in create_peer():", e)
        return False

async def remove_peer(interface_name: str, public_key: str) -> None:
    """
    Equivalent to the C# RemovePeer method:
    Calls 'wg set <interface_name> peer <public_key> remove', captures output,
    and prints any errors. Raises an exception if the process exit code is not zero.
    """
    cmd = ["wg", "set", interface_name, "peer", public_key, "remove"]
    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = await process.communicate()

        output = stdout.decode().strip()
        error_output = stderr.decode().strip()

        # Check the process exit code
        if process.returncode != 0:
            raise Exception(f"wg exited with code {process.returncode}: {error_output}")

        if output:
            print("Output:", output)
        else:
            print("No output received from 'wg set ... remove' command.")
    except Exception as e:
        print("An error occurred in remove_peer():", e)

# Example usage
# if __name__ == "__main__":
#     async def main():
#         # Create example data
#         peer_dto = AddPeerDto(
#             public_key="somePublicKey",
#             allowed_ips=["10.0.0.1/32", "10.0.0.2/32"]
#         )
#         interface_obj = Interface(name="wg0")
#
#         # Call create_peer
#         success = await create_peer(peer_dto, interface_obj)
#         print("CreatePeer result:", success)
#
#         # Call remove_peer
#         await remove_peer(interface_obj.Name, peer_dto.PublicKey)
#
#     asyncio.run(main())
