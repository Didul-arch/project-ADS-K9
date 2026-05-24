from app.domains.user.entity import UserEntity
from app.infrastructure.repositories.user_repository import UserRepository
from app.domains.user.entity import Role


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def get_user_by_id(self, user_id: int) -> UserEntity | None:
        return await self.user_repo.get_by_id(user_id)

    async def get_user_by_email(self, email: str) -> UserEntity | None:
        return await self.user_repo.get_by_email(email)

    async def get_all_users(self) -> list[UserEntity]:
        return await self.user_repo.get_all()

    async def create_user(self, user: UserEntity) -> UserEntity:
        if len(user.fullname.strip()) < 3:
            raise ValueError("Nama user minimal 3 karakter.")
        if "@" not in user.email:
            raise ValueError("Format email tidak valid.")
        if not user.password_hashed.strip():
            raise ValueError("Password wajib diisi.")

        # Resolve role based on email (business rule)
        email_lower = user.email.strip().lower()
        if email_lower.endswith(("@apps.ipb.ac.id", "@ipb.ac.id")):
            user.role = Role.CIVITAS
        else:
            user.role = Role.UMUM

        # For civitas users, require at least one identity field
        if user.role == Role.CIVITAS:
            id_num = (user.identity_number or "").strip()
            id_doc = (user.identity_document or "").strip()
            if not id_num and not id_doc:
                raise ValueError("Civitas users must provide either identity_number or identity_document")

        return await self.user_repo.create(user)
