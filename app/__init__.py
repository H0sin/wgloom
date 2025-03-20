import logging

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from config import DOCS, ALLOWED_ORIGINS, REDOC

logger = logging.getLogger("uvicorn.error")

__version__ = "0.0.1"

app = FastAPI(
    title='chiz market API',
    description='shop for digital software',
    version=__version__,
    docs_url="/docs" if DOCS else None,
    redoc_url="/redoc" if REDOC else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app import routers
from app.routers import api_router

app.include_router(api_router)
