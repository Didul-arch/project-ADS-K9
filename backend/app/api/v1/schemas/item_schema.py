from pydantic import BaseModel


class ReportItemRequest(BaseModel):
    title: str
    description: str
    location: str
    reporter_id: int