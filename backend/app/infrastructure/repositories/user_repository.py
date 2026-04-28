from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.infrastructure.db.models.user_model import UserModel
from app.domains.user.entity import UserEntity 

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> UserEntity | None:
        #cari di postgres pake model
        query = select(UserModel).where(UserModel.email == email)
        result = await self.db.execute(query)
        db_user = result.scalars().first()

        if not db_user:
            return None

        # mapping: model -> entity
        return UserEntity(
            id=db_user.id,
            email=db_user.email,
            fullname=db_user.fullname,
            is_active=db_user.is_active
        )

    async def create(self, user: UserEntity) -> UserEntity:
        #ubah entity ke model buat disave
        new_user = UserModel(
            email=user.email,
            fullname=user.fullname,
            is_active=user.is_active
        )
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)

        user.id = new_user.id
        return user
