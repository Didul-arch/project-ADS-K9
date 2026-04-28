from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas.item_schema import ReportItemRequest
from app.domains.item.entity import ItemEntity, ItemStatus
from app.domains.item.service import ItemService
from app.infrastructure.db.session import get_db
from app.infrastructure.repositories.item_repository import ItemRepository

router = APIRouter()


@router.post("/items/report")
async def report_item(
	payload: ReportItemRequest,
	db: AsyncSession = Depends(get_db),
):
	repo = ItemRepository(db)
	service = ItemService(repo)

	new_item = ItemEntity(
		id=None,
		title=payload.title,
		description=payload.description,
		location=payload.location,
		latitude=None,
		longitude=None,
		status=ItemStatus.LOST,
		reporter_id=payload.reporter_id,
		created_at=datetime.now(),
	)

	try:
		result = await service.report_lost_item(new_item)
		return {"status": "success", "data": result}
	except ValueError as e:
		raise HTTPException(status_code=400, detail=str(e))


@router.get("/items/")
async def list_items(db: AsyncSession = Depends(get_db)):
	repo = ItemRepository(db)
	items = await repo.get_all()
	return {"data": items}
