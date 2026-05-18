from pydantic import BaseModel


class ReportItemRequest(BaseModel):
    title: str
    description: str
    location: str
    latitude: float | None = None
    longitude: float | None = None
    image: str | None = None


class ReportFoundItemRequest(BaseModel):
    title: str
    description: str
    location: str
    latitude: float | None = None
    longitude: float | None = None
    image: str | None = None