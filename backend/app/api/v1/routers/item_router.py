from datetime import datetime
from datetime import date

from app.api.v1.routers.auth_router import get_current_user
from app.domains.user.entity import UserEntity
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.schemas.item_schema import ReportFoundItemRequest, ReportItemRequest
from app.domains.item.entity import ItemEntity, ItemStatus, ReportType
from app.domains.item.service import ItemService
from app.infrastructure.db.session import get_db
from app.infrastructure.repositories.item_repository import ItemRepository

router = APIRouter()


def build_item(payload, status: ItemStatus, report_type: ReportType, reporter_id: int) -> ItemEntity:
	return ItemEntity(
		id=None,
		title=payload.title,
		description=payload.description,
		location=payload.location,
		image=payload.image,
		latitude=None,
		longitude=None,
		report_type=report_type,
		status=status,
		reporter_id=reporter_id,
		created_at=datetime.now(),
	)


@router.post("/items/report-lost")
async def report_lost_item(
	payload: ReportItemRequest,
	db: AsyncSession = Depends(get_db),
	current_user: UserEntity = Depends(get_current_user)
):
	repo = ItemRepository(db)
	service = ItemService(repo)

	reporter_id = current_user.id

	try:
		result = await service.report_lost_item(
			build_item(payload, ItemStatus.LOST, ReportType.LOST, reporter_id)
		)
		return {"status": "success", "data": result}
	except ValueError as e:
		raise HTTPException(status_code=400, detail=str(e))


@router.post("/items/report-found")
async def report_found_item(
	payload: ReportFoundItemRequest,
	db: AsyncSession = Depends(get_db),
	current_user: UserEntity = Depends(get_current_user)
):
	repo = ItemRepository(db)
	service = ItemService(repo)

	reporter_id = current_user.id

	try:
		result = await service.report_found_item(
			build_item(payload, ItemStatus.FOUND, ReportType.FOUND, reporter_id)
		)
		return {"status": "success", "data": result}
	except ValueError as e:
		raise HTTPException(status_code=400, detail=str(e))


@router.get("/items/")
async def list_items(db: AsyncSession = Depends(get_db)):
	repo = ItemRepository(db)
	items = await repo.get_all()
	return {"data": items}


@router.get("/items/search")
async def search_item_by_title(
	report_type: ReportType | None = None,
	location: str | None = None,
	report_date: date | None = None,
	db: AsyncSession = Depends(get_db),
):
	repo = ItemRepository(db)
	service = ItemService(repo)
	items = await service.get_filtered_items(
		report_type=report_type,
		location=location,
		report_date=report_date,
	)
	return {"data": items}
