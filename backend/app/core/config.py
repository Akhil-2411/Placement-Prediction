import os
from pathlib import Path
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    PROJECT_NAME: str = "Placement Intelligence API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Model configuration
    MODEL_PATH: str = os.getenv("MODEL_PATH", str(BASE_DIR / "models" / "placement_model_balanced.joblib"))
    
    # Supabase configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://lcrfmpppwfsxccfbvnqy.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "sb_publishable_jlA2LMbgNvyMs6EDdgHraw_YnWhmOWY")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
