from pydantic import field_validator
from sqlalchemy.engine import make_url
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str

    @field_validator("DATABASE_URL")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        # Keep the app on the async PostgreSQL driver even if prod still provides
        # a plain postgres URL or a sync postgres driver.
        url = make_url(value)

        if url.drivername in {"postgres", "postgresql"}:
            return str(url.set(drivername="postgresql+asyncpg"))

        if url.drivername.startswith("postgresql+") and url.drivername != "postgresql+asyncpg":
            return str(url.set(drivername="postgresql+asyncpg"))

        return value

    # Auth settings
    SECRET_KEY: str
    ALGORITHM: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    CLAIM_UPLOAD_DIR: str = "storage/claims"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

settings = Settings()

