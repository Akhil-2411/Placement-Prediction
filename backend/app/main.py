import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1.router import api_router
from .ml.inference import ml_model

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML model once
    logger.info("Starting up Placement Intelligence API...")
    ml_model._load_model()
    if ml_model.is_loaded:
        logger.info("Placement ML model loaded successfully into memory.")
    else:
        logger.warning("ML model could not be loaded at startup.")
    yield
    # Shutdown
    logger.info("Shutting down Placement Intelligence API...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production-grade Placement Intelligence ML service. "
        "Provides inference with calibrated probabilities, mathematical factor attribution, "
        "cohort readiness analytics, and eligibility checking."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root & Health endpoints
@app.get("/", tags=["Health"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "model_loaded": ml_model.is_loaded,
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "healthy" if ml_model.is_loaded else "degraded",
        "model_loaded": ml_model.is_loaded,
        "model_path": settings.MODEL_PATH
    }

# Register V1 API router
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
