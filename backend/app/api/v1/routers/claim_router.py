from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas.claim_schema import CreateClaimRequest, ReviewClaimRequest
from app.domains.claim.entity import ClaimEntity, ClaimStatus
from app.domains.claim.service import ClaimService
from app.infrastructure.db.session import get_db
from app.infrastructure.repositories.claim_repository import ClaimRepository

router = APIRouter()


def build_claim(payload: CreateClaimRequest) -> ClaimEntity:
	return ClaimEntity(
		id=None,
		proof_text=payload.proof_text,
		proof_image=payload.proof_image,
		status=ClaimStatus.PENDING,
		claimer_id=payload.claimer_id,
		item_id=payload.item_id,
		reviewer_id=None,
		reviewed_at=None,
		created_at=datetime.now(),
		updated_at=None,
	)


@router.post("/claims/")
async def create_claim(payload: CreateClaimRequest, db: AsyncSession = Depends(get_db)):
	repo = ClaimRepository(db)
	service = ClaimService(repo)

	try:
		claim = await service.submit_claim(build_claim(payload))
		return {"status": "success", "data": claim}
	except ValueError as e:
		raise HTTPException(status_code=400, detail=str(e))


@router.get("/claims/")
async def list_claims(
	claim_date: date | None = None,
	reviewer_id: int | None = None,
	claimer_id: int | None = None,
	status: ClaimStatus | None = None,
	limit: int = 20,
	db: AsyncSession = Depends(get_db),
):
	repo = ClaimRepository(db)
	service = ClaimService(repo)

	claims = await service.get_all(
		claim_date=claim_date,
		reviewer_id=reviewer_id,
		claimer_id=claimer_id,
		status=status,
		limit=limit,
	)
	return {"data": claims}


@router.get("/claims/{claim_id}")
async def get_claim_detail(claim_id: int, db: AsyncSession = Depends(get_db)):
	repo = ClaimRepository(db)
	service = ClaimService(repo)
	claim = await service.get_by_id(claim_id)

	if not claim:
		raise HTTPException(status_code=404, detail="Claim tidak ditemukan")

	return {"data": claim}


@router.patch("/claims/{claim_id}/review")
async def review_claim(
	claim_id: int,
	payload: ReviewClaimRequest,
	db: AsyncSession = Depends(get_db),
):
	repo = ClaimRepository(db)
	service = ClaimService(repo)

	try:
		reviewed_claim = await service.review_claim(
			claim_id=claim_id,
			new_status=payload.status,
			reviewer_id=payload.reviewer_id,
		)
	except ValueError as e:
		raise HTTPException(status_code=400, detail=str(e))

	if not reviewed_claim:
		raise HTTPException(status_code=404, detail="Claim tidak ditemukan")

	return {"status": "success", "data": reviewed_claim}
