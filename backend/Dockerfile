# 1. Use a minimal Python image
FROM python:3.11-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy dependencies and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Buat direktori storage
RUN mkdir -p storage

# (Opsional) Pastikan hak aksesnya bisa ditulis 
RUN chmod 777 storage

# 4. Copy your application code
COPY ./app ./app
# Copy Alembic config and migrations so we can run migrations inside the container
COPY ./alembic.ini ./alembic.ini
COPY ./alembic ./alembic
COPY ./entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

# 5. Run migrations first, then start the app
ENTRYPOINT ["/app/entrypoint.sh"]
