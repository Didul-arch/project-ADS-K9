from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.db.models.item_model import ItemModel
from app.domains.item.entity import ItemEntity
from sqlalchemy import select

class ItemRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    # 1. Save new item
    async def save(self, item: ItemEntity) -> ItemEntity:
        db_item = ItemModel(
            title=item.title,
            description=item.description,
            location=item.location,
            latitude=item.latitude,
            longitude=item.longitude,
            status=item.status,
            reporter_id=item.reporter_id,
            created_at=item.created_at
        )
        self.db.add(db_item)
        await self.db.commit()
        await self.db.refresh(db_item)
        
        item.id = db_item.id
        return item

    # 2. Cari Semua Barang 
    async def get_all(self, limit: int = 100) -> list[ItemEntity]:
        query = select(ItemModel).order_by(ItemModel.created_at.desc()).limit(limit)
        result = await self.db.execute(query)
        db_items = result.scalars().all()
        
        # Balikin dalam bentuk list of Entities (Mapping massal)
        return [
            ItemEntity(
                id=item.id, title=item.title, description=item.description,
                location=item.location, latitude=item.latitude, longitude=item.longitude,
                status=item.status, reporter_id=item.reporter_id, created_at=item.created_at
            ) for item in db_items
        ]

    # 3. Cari Barang Berdasarkan ID 
    async def get_by_id(self, item_id: int) -> ItemEntity | None:
        result = await self.db.execute(select(ItemModel).where(ItemModel.id == item_id))
        item = result.scalars().first()
        
        if not item: return None
        
        return ItemEntity(
            id=item.id, title=item.title, description=item.description,
            location=item.location, latitude=item.latitude, longitude=item.longitude,
            status=item.status, reporter_id=item.reporter_id, created_at=item.created_at
        )
