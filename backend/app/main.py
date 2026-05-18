from fastapi import FastAPI, Request
import time

# Import Infrastruktur (Database & Session)
from app.infrastructure.db.session import engine, Base
from app.api.v1.routers.auth_router import router as auth_router
from app.api.v1.routers.claim_router import router as claim_router
from app.api.v1.routers.item_router import router as item_router
from app.api.v1.routers.user_router import router as user_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SIPESAT - Lost & Found IPB")

# Enable CORS for cross-origin API calls from the React frontend port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(claim_router)
app.include_router(item_router)
app.include_router(user_router)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables Synced!")

@app.get("/")
def read_root():
    return {"message": "API is running!"}
