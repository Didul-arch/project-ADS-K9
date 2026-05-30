# Backend FoundIt - Lost and Found IPB

## Tech Stack

- Framework: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy 2.0 (Async)
- Driver DB: asyncpg

## Menjalankan Backend

### Startup dengan Docker

1. Stop dan bersihkan container lama kalau masih jalan:

```bash
docker compose down
```

2. Build dan jalankan service backend + database:

```bash
docker compose up -d --build
```

3. Jalankan migrasi Alembic dari dalam container backend, bukan dari local machine:

```bash
docker compose exec ads_backend alembic upgrade head
```

4. Backend sudah siap diakses di `http://localhost:8000`.

### Mode lokal (opsional)

Kalau kamu ingin jalan tanpa Docker untuk development cepat, install dependensi lalu jalankan server:

1. Instal dependensi:

```bash
pip install -r requirements.txt
```

2. Jalankan server:

```bash
uvicorn app.main:app --reload
```

3. (Opsional) Jalankan seeding data awal:

```bash
python -m app.seed
```

## Endpoint Aktif Saat Ini

- `GET /` - health check.
- `POST /users/` - membuat user.
- `GET /users/` - daftar user untuk admin.
- `PATCH /users/me` - update profil sendiri.
- `PATCH /users/{user_id}` - update parsial user untuk admin.
- `DELETE /users/{user_id}` - hapus user untuk admin.
- `POST /items/report` - melaporkan barang hilang.
- `GET /items/` - menampilkan daftar item.
untuk endpoint selengkapnya bisa ke endpoint /docs di web browser kesayangan kalian.