import uvicorn
from fastapi import FastAPI
from app import app, logger
from config import DEBUG
import logging

if __name__ == "__main__":
    bind_args = {}

    if DEBUG:
        bind_args['uds'] = None
        bind_args['host'] = '0.0.0.0'

    try:
        uvicorn.run(
            "main:app",
            **bind_args,
            workers=1,
            reload=DEBUG,
            log_level=logging.DEBUG if DEBUG else logging.INFO
        )
    except FileNotFoundError:
        pass
