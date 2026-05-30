#!/bin/sh
set -e

echo "Running database migrations..."
for attempt in 1 2 3 4 5; do
  if alembic upgrade head; then
    echo "Migrations applied successfully."
    break
  fi

  if [ "$attempt" -eq 5 ]; then
    echo "Migration failed after 5 attempts."
    exit 1
  fi

  echo "Migration attempt $attempt failed. Retrying in 5 seconds..."
  sleep 5
done

echo "Starting backend server..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"