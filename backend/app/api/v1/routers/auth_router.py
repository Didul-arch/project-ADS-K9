from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas.user_schema import CreateUserRequest
from app.domains.user.entity import UserEntity
from app.infrastructure.db.session import get_db
from app.infrastructure.repositories.user_repository import UserRepository

router = APIRouter()


@router.post("/users/")
async def create_user(payload: CreateUserRequest, db: AsyncSession = Depends(get_db)):
	repo = UserRepository(db)
	user_data = UserEntity(
		id=None,
		email=payload.email,
		fullname=payload.fullname,
		is_active=True,
	)
	created_user = await repo.create(user_data)
	return {"message": "User Berhasil Dibuat", "data": created_user}
