from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

# Import Infrastruktur (Database & Session)
from app.infrastructure.db.session import get_db, engine, Base

# Import Repository 
from app.infrastructure.repositories.user_repository import UserRepository
from app.infrastructure.repositories.item_repository import ItemRepository

# Import Service 
from app.domains.item.service import ItemService

# Import Domain (Entity & Enum)
from app.domains.item.entity import ItemEntity, ItemStatus
from app.domains.user.entity import UserEntity

app = FastAPI(title="SIPESAT - Lost & Found IPB")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables Synced!")

#ENDPOINT USER (Contoh Setup Awal)
@app.post("/users/")
async def create_user(email: str, fullname: str, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    
    # Bungkus ke Entity
    user_data = UserEntity(id=None, email=email, fullname=fullname, is_active=True)
    
    # Simpan lewat Repo
    created_user = await repo.create(user_data)
    return {"message": "User Amanah Berhasil Dibuat", "data": created_user}

#ENDPOINT LOST & FOUND (Pake Service)
@app.post("/items/report")
async def report_item(
    title: str, 
    description: str, 
    location: str,
    reporter_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Inisialisasi 'Pipa' Layanan
    repo = ItemRepository(db)
    service = ItemService(repo)
    
    # Siapkan data dalam bentuk Entity (Pure Domain)
    new_item = ItemEntity(
        id=None,
        title=title,
        description=description,
        location=location,
        latitude=None, # Opsional dulu
        longitude=None, # Opsional dulu
        status=ItemStatus.LOST,
        reporter_id=reporter_id,
        created_at=datetime.now(timezone.utc)
    )
    
    try:
        result = await service.report_lost_item(new_item)
        return {"status": "success", "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/items/")
async def list_items(db: AsyncSession = Depends(get_db)):
    repo = ItemRepository(db)
    items = await repo.get_all()
    return {"data": items}

@app.get("/")
def read_root():
    return {"message": "API is running!"}
