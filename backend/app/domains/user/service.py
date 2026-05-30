from app.domains.user.entity import UserEntity
from app.infrastructure.repositories.user_repository import UserRepository
from app.domains.user.entity import Role


class DuplicateUserError(ValueError):
    pass


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def get_user_by_id(self, user_id: int) -> UserEntity | None:
        return await self.user_repo.get_by_id(user_id)

    async def get_user_by_email(self, email: str) -> UserEntity | None:
        return await self.user_repo.get_by_email(email)

    async def get_all_users(self) -> list[UserEntity]:
        return await self.user_repo.get_all()

    async def get_user_or_raise(self, user_id: int) -> UserEntity:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise ValueError("User tidak ditemukan")
        return user

    async def delete_user(self, user_id: int) -> bool:
        return await self.user_repo.delete(user_id)

    def _normalize_identity_document(self, identity_document: str | None) -> str | None:
        if identity_document is None:
            return None

        cleaned = identity_document.strip()
        return cleaned or None

    def _ensure_civitas_identity(
        self,
        current_user: UserEntity,
        identity_number: str | None,
        identity_document: str | None,
    ) -> None:
        has_identity = any(
            [
                (identity_number or current_user.identity_number or "").strip(),
                (identity_document or current_user.identity_document or "").strip(),
            ]
        )
        if not has_identity:
            raise ValueError("Civitas users must provide either identity_number or identity_document")

    async def update_user_profile(
        self,
        user_id: int,
        fullname: str | None = None,
        role: Role | None = None,
        is_active: bool | None = None,
        identity_number: str | None = None,
        identity_document: str | None = None,
    ) -> UserEntity:
        current_user = await self.get_user_or_raise(user_id)
        if fullname is None or not fullname.strip():
            raise ValueError("Nama user wajib diisi")

        target_role = role or current_user.role
        resolved_identity_document = self._normalize_identity_document(identity_document)

        if target_role == Role.CIVITAS:
            self._ensure_civitas_identity(current_user, identity_number, resolved_identity_document)

        updated_user = await self.user_repo.update(
            user_id,
            fullname=fullname,
            role=role,
            is_active=is_active,
            identity_number=identity_number,
            identity_document=resolved_identity_document,
        )

        if not updated_user:
            raise ValueError("User tidak ditemukan")

        return updated_user

    async def update_own_profile(
        self,
        current_user: UserEntity,
        fullname: str | None = None,
        identity_number: str | None = None,
        identity_document: str | None = None,
    ) -> UserEntity:
        if current_user.id is None:
            raise ValueError("User id missing")

        return await self.update_user_profile(
            user_id=current_user.id,
            fullname=fullname,
            identity_number=identity_number,
            identity_document=identity_document,
        )

    async def create_user(self, user: UserEntity) -> UserEntity:
        if len(user.fullname.strip()) < 3:
            raise ValueError("Nama user minimal 3 karakter.")
        if "@" not in user.email:
            raise ValueError("Format email tidak valid.")
        if not user.password_hashed.strip():
            raise ValueError("Password wajib diisi.")

        existing_user = await self.user_repo.get_by_email(user.email)
        if existing_user:
            raise DuplicateUserError("Email sudah terdaftar.")

        # Resolve role based on email
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
