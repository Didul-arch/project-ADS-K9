# Backend FoundIt - Lost and Found IPB

## Tech Stack

- Framework: FastAPI
- Database: PostgreSQL
- ORM: SQLAlchemy 2.0 (Async)
- Driver DB: asyncpg
- Storage: local folder or S3-compatible bucket

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

## Konfigurasi Bucket di Railway

Kalau kamu mau gambar tersimpan ke bucket, set environment variable berikut di Railway service backend:

```env
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=nama-bucket-kamu
S3_REGION=region-bucket-kamu
S3_ACCESS_KEY_ID=access-key
S3_SECRET_ACCESS_KEY=secret-key
S3_ENDPOINT_URL=https://endpoint-s3-kamu
S3_FORCE_PATH_STYLE=false
```

Kalau provider bucket kamu menyarankan virtual-hosted-style URLs, biarkan `S3_FORCE_PATH_STYLE=false`.
Kalau upload error karena addressing style, ubah jadi `true`.

`S3_PUBLIC_URL` opsional. Kalau tidak diisi, backend akan membentuk URL dari `S3_ENDPOINT_URL` dan `S3_BUCKET_NAME`.

Kalau env di atas belum diset, backend tetap memakai folder lokal `storage/` seperti sebelumnya.

Folder local yang dipakai saat development: `storage/items`, `storage/claims`, dan `storage/identity-documents` untuk identity document user.

## Konfigurasi CORS di Railway

Kalau frontend kamu sudah deploy, tambahkan origin frontend ke env backend:

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://frontend-kamu.up.railway.app
```

Kalau kamu punya lebih dari satu frontend origin, pisahkan dengan koma.

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
