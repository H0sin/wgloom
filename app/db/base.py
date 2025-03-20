from typing import Any, AsyncGenerator

from sqlalchemy import create_engine, Column, Integer
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from config import (SQLALCHEMY_DATABASE_URL,
                    SQLALCHEMY_POOL_SIZE,
                    SQLALCHEMY_MAX_OVERFLOW,)

IS_SQLITE = SQLALCHEMY_DATABASE_URL.startswith('sqlite')

if IS_SQLITE:
    engine = create_async_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_async_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_size=SQLALCHEMY_POOL_SIZE,
        max_overflow=SQLALCHEMY_MAX_OVERFLOW,
        pool_recycle=3600,
        pool_timeout=10
    )

AsyncSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine,expire_on_commit=False)

class Base(DeclarativeBase):
    id = Column(Integer,primary_key=True)


async def get_db() -> AsyncGenerator[AsyncSession, Any]:
    """Yield an async database session."""
    async with AsyncSessionLocal() as session:
        yield session
