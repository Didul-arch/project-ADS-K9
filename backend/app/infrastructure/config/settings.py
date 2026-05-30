from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str

    # Auth settings
    SECRET_KEY: str
    ALGORITHM: str 
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    CLAIM_UPLOAD_DIR: str = "storage/claims"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if not isinstance(value, str):
            return value

        url = value.strip()
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://"):]

        if url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
            url = "postgresql+asyncpg://" + url[len("postgresql://"):]

        if url.startswith("postgresql+psycopg2://"):
            url = "postgresql+asyncpg://" + url[len("postgresql+psycopg2://"):]

        parts = urlsplit(url)
        if not parts.query:
            return url

        query_pairs = parse_qsl(parts.query, keep_blank_values=True)
        normalized_pairs: list[tuple[str, str]] = []
        for key, query_value in query_pairs:
            if key == "sslmode":
                normalized_pairs.append(("ssl", query_value))
            else:
                normalized_pairs.append((key, query_value))

        normalized_query = urlencode(normalized_pairs)
        return urlunsplit((parts.scheme, parts.netloc, parts.path, normalized_query, parts.fragment))

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

settings = Settings()

