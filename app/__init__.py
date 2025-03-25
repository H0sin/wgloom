import logging

from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from config import DOCS, ALLOWED_ORIGINS, REDOC, WG_SUBSCRIPTION_PATH

logger = logging.getLogger("uvicorn.error")

__version__ = "0.0.1"

app = FastAPI(
    title='WgLoomApi',
    description='wireguard accounting panel',
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

from app import routers,dashboard
from app.routers import api_router

app.include_router(api_router)

@app.on_event("startup")
def on_startup():
    paths = [f"{r.path}/" for r in app.routes]
    paths.append("/api/")
    if f"/{WG_SUBSCRIPTION_PATH}/" in paths:
        raise ValueError(
            f"you can't use /{WG_SUBSCRIPTION_PATH}/ as subscription path it reserved for {app.title}"
        )

@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    details = {}
    for error in exc.errors():
        details[error["loc"][-1]] = error.get("msg")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": details}),
    )
