# ai generated heheh :p
import asyncio
from datetime import datetime, timezone
from app.infrastructure.db.session import AsyncSessionLocal, engine, Base
from app.infrastructure.db.models.user_model import UserModel
from app.infrastructure.db.models.item_model import ItemModel
from app.domains.item.entity import ItemStatus, ReportType

async def seed_data():
    async with engine.begin() as conn:
        print("🧹 Reset database schema...")
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        async with session.begin():
            print("🌱 Memulai seeding data...")

            user1 = UserModel(
                email="didul@apps.ipb.ac.id",
                full_name="Syafiq Syadidul Azmi",
                is_active=True,
            )
            user2 = UserModel(
                email="budi@apps.ipb.ac.id",
                full_name="Budi Budiman",
                is_active=True,
            )
            session.add_all([user1, user2])

            await session.flush()

            now_naive = datetime.now(timezone.utc).replace(tzinfo=None)

            item1 = ItemModel(
                title="Kunci Motor Honda",
                description="Gantungan kunci IPB warna merah, ilang deket GWW.",
                location="Parkiran GWW",
                image="/images/items/kunci-motor-honda.jpg",
                report_type=ReportType.LOST,
                status=ItemStatus.LOST,
                reporter_id=user1.id,
                created_at=now_naive,
            )

            item2 = ItemModel(
                title="Tumbler Tuku",
                description="Warna hitam polos, 500ml. Ketemu di meja perpus LSI.",
                location="Perpustakaan LSI",
                image="/images/items/tumbler-tuku.jpg",
                report_type=ReportType.FOUND,
                status=ItemStatus.FOUND,
                reporter_id=user2.id,
                created_at=now_naive,
            )

            session.add_all([item1, item2])

        print("✅ Seeding selesai! Database sudah di-reset dan diisi ulang dari nol.")

if __name__ == "__main__":
    try:
        asyncio.run(seed_data())
    except Exception as e:
        print(f"❌ Waduh gagal seed, Dul! Error: {e}")
