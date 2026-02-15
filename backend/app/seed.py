# ai generated heheh :p
import asyncio
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.infrastructure.db.session import AsyncSessionLocal, engine, Base
from app.infrastructure.db.models.user_model import UserModel
from app.infrastructure.db.models.item_model import ItemModel
from app.domains.item.entity import ItemStatus

async def seed_data():
    # Gunakan AsyncSessionLocal sesuai saran error sebelumnya
    async with AsyncSessionLocal() as session:
        async with session.begin():
            print("🌱 Memulai seeding data...")

            # 1. Seed Users (Mahasiswa IPB)
            user1 = UserModel(
                email="didul@apps.ipb.ac.id", 
                full_name="Syafiq Syadidul Azmi", 
                is_active=True
            )
            user2 = UserModel(
                email="budi@apps.ipb.ac.id", 
                full_name="Budi Budiman", 
                is_active=True
            )
            session.add_all([user1, user2])
            
            # Flush supaya ID user terbentuk untuk relasi reporter_id
            await session.flush() 

            # Ambil waktu sekarang dan hilangkan info timezone (Naive) 
            # supaya cocok dengan kolom TIMESTAMP WITHOUT TIME ZONE di Postgres
            now_naive = datetime.now(timezone.utc).replace(tzinfo=None)

            # 2. Seed Items (Barang Hilang & Temu)
            item1 = ItemModel(
                title="Kunci Motor Honda",
                description="Gantungan kunci IPB warna merah, ilang deket GWW.",
                location="Parkiran GWW",
                status=ItemStatus.LOST,
                reporter_id=user1.id,
                created_at=now_naive
            )

            item2 = ItemModel(
                title="Tumbler Tuku",
                description="Warna hitam polos, 500ml. Ketemu di meja perpus LSI.",
                location="Perpustakaan LSI",
                status=ItemStatus.FOUND,
                reporter_id=user2.id,
                created_at=now_naive
            )

            session.add_all([item1, item2])
            
        # Commit dilakukan otomatis saat keluar dari block 'async with session.begin()'
        print("✅ Seeding selesai! Data mahasiswa dan barang sudah masuk ke Postgres.")

if __name__ == "__main__":
    try:
        asyncio.run(seed_data())
    except Exception as e:
        print(f"❌ Waduh gagal seed, Dul! Error: {e}")
