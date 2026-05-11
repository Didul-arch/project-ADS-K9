from fastapi import FastAPI

# Import Infrastruktur (Database & Session)
from app.infrastructure.db.session import engine, Base
from app.api.v1.routers.auth_router import router as auth_router
from app.api.v1.routers.claim_router import router as claim_router
from app.api.v1.routers.item_router import router as item_router

app = FastAPI(title="SIPESAT - Lost & Found IPB")
app.include_router(auth_router)
app.include_router(claim_router)
app.include_router(item_router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables Synced!")

@app.get("/")
def read_root():
    return {"message": "API is running!"}
