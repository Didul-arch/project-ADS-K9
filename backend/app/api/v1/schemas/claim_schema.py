from pydantic import BaseModel

from app.domains.claim.entity import ClaimStatus


class CreateClaimRequest(BaseModel):
    proof_text: str
    proof_image: str | None = None
    claimer_id: int
    item_id: int


class ReviewClaimRequest(BaseModel):
    status: ClaimStatus
    reviewer_id: int
