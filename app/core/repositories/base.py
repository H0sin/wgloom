# repositories/base.py
from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.base import Base  # Import your Base from the correct path

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType")

class BaseRepository(Generic[ModelType, CreateSchemaType]):
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Create a new record from the input schema."""
        obj_data = obj_in.dict()
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def get(self, id: int) -> Optional[ModelType]:
        """Retrieve a single record by ID."""
        result = await self.db.execute(select(self.model).filter_by(id=id))
        return result.scalars().first()

    async def list(self) -> List[ModelType]:
        """Retrieve all records of the model."""
        result = await self.db.execute(select(self.model))
        return result.scalars().all()

    async def update(self, id: int, obj_in: CreateSchemaType) -> Optional[ModelType]:
        """Update an existing record by ID with the given input schema."""
        db_obj = await self.get(id)
        if not db_obj:
            return None
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete(self, id: int) -> bool:
        """Delete a record by ID. Returns True if successful, False otherwise."""
        db_obj = await self.get(id)
        if not db_obj:
            return False
        await self.db.delete(db_obj)
        await self.db.commit()
        return True
