#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set. Configure Railway variable first."
  exit 1
fi

echo "Running database migrations..."
for attempt in $(seq 1 30); do
  if alembic upgrade head; then
    echo "Migrations applied successfully."
    break
  fi

  if [ "$attempt" -eq 30 ]; then
    echo "Migration failed after 30 attempts."
    exit 1
  fi

  echo "Migration attempt $attempt failed. Retrying in 3 seconds..."
  sleep 3
done

echo "Starting backend server..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"