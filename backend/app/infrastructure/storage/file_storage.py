from pathlib import Path
from urllib.parse import urlparse
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from botocore.config import Config

from app.infrastructure.config.settings import settings


def _build_file_name(upload_file: UploadFile, default_extension: str) -> str:
	extension = Path(upload_file.filename or "file").suffix or default_extension
	return f"{uuid4().hex}{extension}"


def _save_locally(upload_file: UploadFile, storage_dir: Path, file_name: str, subdir: str) -> str:
	storage_dir.mkdir(parents=True, exist_ok=True)
	upload_file.file.seek(0)
	(storage_dir / file_name).write_bytes(upload_file.file.read())
	return f"/storage/{subdir}/{file_name}"


def _save_to_s3(upload_file: UploadFile, object_key: str) -> str:
	if not settings.S3_BUCKET_NAME:
		raise HTTPException(status_code=500, detail="S3_BUCKET_NAME belum diset")

	import boto3

	addressing_style = "path" if settings.S3_FORCE_PATH_STYLE else "virtual"
	client = boto3.client(
		"s3",
		region_name=settings.S3_REGION,
		endpoint_url=settings.S3_ENDPOINT_URL,
		aws_access_key_id=settings.S3_ACCESS_KEY_ID,
		aws_secret_access_key=settings.S3_SECRET_ACCESS_KEY,
		config=Config(s3={"addressing_style": addressing_style}),
	)
	upload_file.file.seek(0)
	client.upload_fileobj(
		upload_file.file,
		settings.S3_BUCKET_NAME,
		object_key,
		ExtraArgs={
			"ContentType": upload_file.content_type or "application/octet-stream",
		},
	)
	return _build_public_url(object_key)


def _build_public_url(object_key: str) -> str:
	if settings.S3_PUBLIC_URL:
		return f"{settings.S3_PUBLIC_URL.rstrip('/')}/{object_key}"

	if not settings.S3_ENDPOINT_URL or not settings.S3_BUCKET_NAME:
		raise HTTPException(status_code=500, detail="S3_ENDPOINT_URL atau S3_BUCKET_NAME belum diset")

	endpoint = urlparse(settings.S3_ENDPOINT_URL)
	if not endpoint.scheme or not endpoint.netloc:
		raise HTTPException(status_code=500, detail="S3_ENDPOINT_URL tidak valid")

	if settings.S3_FORCE_PATH_STYLE:
		return f"{settings.S3_ENDPOINT_URL.rstrip('/')}/{settings.S3_BUCKET_NAME}/{object_key}"

	return f"{endpoint.scheme}://{settings.S3_BUCKET_NAME}.{endpoint.netloc}/{object_key}"


def save_upload_file(upload_file: UploadFile, *, subdir: str, default_extension: str = ".bin") -> str:
	file_name = _build_file_name(upload_file, default_extension)
	object_key = f"{subdir}/{file_name}"

	if settings.STORAGE_PROVIDER.lower() == "s3":
		return _save_to_s3(upload_file, object_key)

	storage_dir = Path("storage") / subdir
	return _save_locally(upload_file, storage_dir, file_name, subdir)