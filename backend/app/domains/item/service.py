from app.domains.item.entity import ItemEntity, ItemStatus
from app.infrastructure.repositories.item_repository import ItemRepository

class ItemService:
    def __init__(self, item_repo: ItemRepository):
        self.item_repo = item_repo

    async def report_lost_item(self, item: ItemEntity) -> ItemEntity:
        # 1. Validasi: Judul jangan kependekan
        if len(item.title) < 5:
            raise ValueError("Judul laporan minimal 5 karakter.")

        # 2. Aturan: Pastikan status awalnya LOST kalau lewat jalur lapor hilang
        item.status = ItemStatus.LOST
        
        # 3. Simpan ke database lewat Repository
        return await self.item_repo.save(item)

    async def get_all_items(self):
        return await self.item_repo.get_all()
