import os, uuid, io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from minio import Minio
from minio.error import S3Error

S3_ENDPOINT = os.getenv("S3_ENDPOINT", "http://minio:9000")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", "minio")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", "minio123")
BUCKET       = os.getenv("SOMNIA_BUCKET", "somnia-audio")
MAX_AUDIO_MB = int(os.getenv("MAX_AUDIO_MB", "20"))

origins = [o.strip() for o in os.getenv("CORS_ORIGINS","*").split(",")]

app = FastAPI(title="Somnia API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MinIO client
client = Minio(
    S3_ENDPOINT.replace("http://","").replace("https://",""),
    access_key=S3_ACCESS_KEY,
    secret_key=S3_SECRET_KEY,
    secure=S3_ENDPOINT.startswith("https"),
)

# Ensure bucket
if not client.bucket_exists(BUCKET):
    client.make_bucket(BUCKET)

# In-memory jobs (Fase 2)
JOBS: dict[str, dict] = {}  # job_id -> dict(status, object?, transcript?)

@app.get("/health")
def health():
    return {"ok": True, "service": "somnia-api"}

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    if file.content_type not in ("audio/m4a","audio/mp4","audio/aac","audio/x-m4a","application/octet-stream"):
        raise HTTPException(status_code=400, detail="Formato no soportado. Usa .m4a (AAC).")
    data = await file.read()
    size = len(data)
    if size == 0 or size > MAX_AUDIO_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"Archivo vacío o > {MAX_AUDIO_MB}MB")

    job_id = str(uuid.uuid4())
    object_key = f"uploads/{job_id}.m4a"
    try:
      client.put_object(BUCKET, object_key, io.BytesIO(data), size, content_type="audio/m4a")
    except S3Error as e:
      raise HTTPException(status_code=500, detail=f"Almacenamiento: {e}")

    JOBS[job_id] = {"status": "pending", "object": object_key, "transcript": None}
    return {"status": "queued", "job_id": job_id}

class TextPayload(BaseModel):
    text: str
    captured_at: Optional[str] = None

@app.post("/submit-text")
async def submit_text(payload: TextPayload):
    t = (payload.text or "").strip()
    if len(t) < 5:
        raise HTTPException(status_code=400, detail="Texto demasiado corto")
    job_id = str(uuid.uuid4())
    JOBS[job_id] = {
        "status": "pending",
        "object": None,
        "transcript": t,
        "captured_at": payload.captured_at,
    }
    return {"status": "queued", "job_id": job_id}

@app.get("/result/{job_id}")
def get_result(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="job_id no encontrado")
    # Fase 2: siempre "pending"
    return {"job_id": job_id, "status": job["status"]}
