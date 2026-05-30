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

3. Migrasi Alembic sekarang jalan otomatis saat container backend start, jadi tidak perlu `down -v` atau menjalankan migrasi manual setiap deploy.

4. Backend sudah siap diakses di `http://localhost:8000`.

### Deploy ke Railway / Production

- Jangan pakai `docker compose down -v` di production. Itu akan menghapus volume database.
- Biarkan database tetap persisten, lalu deploy ulang aplikasi seperti biasa.
- Container backend akan menjalankan `alembic upgrade head` sebelum server start.
- Kalau kamu menambah migration baru, cukup commit migration file lalu push ke GitHub. Saat Railway redeploy, migrasi akan diterapkan otomatis.
- Kalau perlu menjalankan migrasi manual, pakai `alembic upgrade head` di environment yang terhubung ke database production, bukan reset database.

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
