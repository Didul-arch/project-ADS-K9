from pydantic import BaseModel


class CreateUserRequest(BaseModel):
    email: str
    fullname: str
    password: str
    identity_number: str | None = None
    identity_document: str | None = None

class UserResponse(BaseModel):
    id: int
    email: str
    fullname: str
    is_active: bool
    role: str
    identity_number: str | None = None
    identity_document: str | None = None


class UserInDB(BaseModel):
    id: int
    email: str
    fullname: str
    is_active: bool
    password_hash: str
    identity_number: str | None = None
    identity_document: str | None = None
