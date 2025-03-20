import os
import aiofiles
from app.schemas.interface import InterfaceCreate, InterfaceStatus
import asyncio


async def add_interface_file(interface: InterfaceCreate, directory: str = "") -> bool:
    try:
        content = f"""[Interface]
        Address = {interface.ip_address}
        SaveConfig = {interface.save_config}
        PreUp = {interface.pre_up or ""}
        PostUp = {interface.post_up or ""}
        PreDown = {interface.pre_down or ""}
        PostDown = {interface.post_down or ""}
        ListenPort = {interface.listen_port or ""}
        PrivateKey = {interface.private_key}
        """

        file_path = os.path.join(directory, f"{interface.name}.conf")

        if os.path.exists(file_path):
            raise Exception(f"File by name: {interface.name} already exists")

        async with aiofiles.open(file_path, mode="w") as f:
            await f.write(content)
        return True

    except Exception as e:
        print("Error:", e)
        return False




async def interface_status(status: InterfaceStatus, name: str = "") -> tuple[str, bool]:
    cmd = ["wg-quick", "up" if status == InterfaceStatus.active else "down"]
    if name:
        cmd.append(name)

    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        output = stdout.decode().strip()

        if output:
            print("Output:", output)
        else:
            print("No output received from wg show command.")

        return output, True
    except Exception as e:
        print("An error occurred:", str(e))
        return str(e), False