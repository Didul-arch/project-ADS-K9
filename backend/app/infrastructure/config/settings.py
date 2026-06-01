from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str

    # Auth settings
    SECRET_KEY: str
    ALGORITHM: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # Storage settings
    STORAGE_PROVIDER: str = "local"
    CORS_ORIGINS: str = ""
    CLAIM_UPLOAD_DIR: str = "storage/claims"
    IDENTITY_DOCUMENT_UPLOAD_DIR: str = "storage/identity-documents"
    S3_BUCKET_NAME: str | None = None
    S3_REGION: str | None = None
    S3_ACCESS_KEY_ID: str | None = None
    S3_SECRET_ACCESS_KEY: str | None = None
    S3_ENDPOINT_URL: str | None = None
    S3_PUBLIC_URL: str | None = None
    S3_FORCE_PATH_STYLE: bool = False


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

settings = Settings()  # type: ignore[call-arg]

