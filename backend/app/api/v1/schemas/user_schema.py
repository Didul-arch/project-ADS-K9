from pydantic import BaseModel


class CreateUserRequest(BaseModel):
    email: str
    fullname: str
    password: str
    admin_code: str | None = None

class UserResponse(BaseModel):
    id: int
    email: str
    fullname: str
    is_active: bool
    role: str


class UserInDB(BaseModel):
    id: int
    email: str
    fullname: str
    is_active: bool
    password_hash: str
