# ai generated heheh :p
import asyncio
from datetime import datetime, timezone
from app.infrastructure.db.session import AsyncSessionLocal, engine, Base
from app.infrastructure.db.models.user_model import UserModel
from app.infrastructure.db.models.item_model import ItemModel
from app.infrastructure.db.models.claim_model import ClaimModel
from app.domains.item.entity import ItemStatus, ReportType
from app.domains.user.entity import Role
from app.infrastructure.auth.utils import get_password_hash

async def seed_data():
    async with engine.begin() as conn:
        print("[DB] Reset database schema...")
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        async with session.begin():
            print("[SEED] Memulai seeding data...")

            user1 = UserModel(
                email="syafiq@apps.ipb.ac.id",
                full_name="Syafiq Syadidul Azmi",
                identity_number=None,
                identity_document=None,
                is_active=True,
                password_hash=get_password_hash("syafiq123"),
                role=Role.ADMIN,
            )
            user2 = UserModel(
                email="naufal@apps.ipb.ac.id",
                full_name="Naufal Raya Pragata",
                identity_number=None,
                identity_document=None,
                is_active=True,
                password_hash=get_password_hash("naufal123"),
                role=Role.ADMIN,
            )
            user3 = UserModel(
                email="budi@apps.ipb.ac.id",
                full_name="Budi Santoso",
                identity_number="B2023001",
                identity_document="budi-ktm.jpg",
                is_active=True,
                password_hash=get_password_hash("budi123"),
                role=Role.CIVITAS,
            )
            session.add_all([user1, user2, user3])

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

            item3 = ItemModel(
                title="Dompet Hitam",
                description="Dompet kulit hitam berisi KTM dan kartu.",
                location="Ruang Kuliah A101",
                image="/images/items/dompet-hitam.jpg",
                report_type=ReportType.LOST,
                status=ItemStatus.LOST,
                reporter_id=user3.id,
                created_at=now_naive,
            )

            item4 = ItemModel(
                title="Laptop Lenovo",
                description="Laptop Lenovo ThinkPad, stiker di belakang.",
                location="Laboratorium Komputasi",
                image="/images/items/laptop-lenovo.jpg",
                report_type=ReportType.FOUND,
                status=ItemStatus.FOUND,
                reporter_id=user2.id,
                created_at=now_naive,
            )

            session.add_all([item1, item2, item3, item4])

        print("[SUCCESS] Seeding selesai! Database sudah di-reset dan diisi ulang dari nol.")

if __name__ == "__main__":
    try:
        asyncio.run(seed_data())
    except Exception as e:
        print(f"[ERROR] Waduh gagal seed, Dul! Error: {e}")
