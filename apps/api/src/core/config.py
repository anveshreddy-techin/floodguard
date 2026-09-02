"""
FloodGuard AI — Application Configuration
All settings loaded from environment variables.
"""
from enum import Enum
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"


class DataMode(str, Enum):
    LIVE = "LIVE"
    HISTORICAL = "HISTORICAL"
    UPLOAD = "UPLOAD"
    DEMO = "DEMO"
    SIMULATION = "SIMULATION"
    REPLAY = "REPLAY"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "FloodGuard AI"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = False

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Security
    JWT_SECRET: str = Field(
        default="dev_jwt_secret_change_in_production_min32chars_2026",
        description="JWT signing secret — MUST be overridden in production",
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BCRYPT_ROUNDS: int = 12

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    # Database
    DATABASE_URL: str = Field(
        "postgresql+asyncpg://floodguard:floodguard@localhost:5432/floodguard",
        description="PostgreSQL connection URL with asyncpg driver"
    )
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # Data Mode
    DEFAULT_DATA_MODE: DataMode = DataMode.DEMO
    DEMO_MODE: bool = True  # Forces demo mode

    # External Providers
    WEATHER_PROVIDER: str = "open_meteo"
    WEATHER_API_KEY: str = ""

    RAINFALL_PROVIDER: str = "demo"
    RAINFALL_API_KEY: str = ""

    RIVER_PROVIDER: str = "demo"
    RIVER_API_KEY: str = ""

    SATELLITE_PROVIDER: str = "disabled"
    SATELLITE_API_KEY: str = ""

    # IoT / MQTT
    MQTT_BROKER_URL: str = ""
    MQTT_USERNAME: str = ""
    MQTT_PASSWORD: str = ""
    IOT_ENABLED: bool = False

    # Notifications
    SMS_PROVIDER: str = "disabled"
    SMS_API_KEY: str = ""
    EMAIL_PROVIDER: str = "disabled"
    EMAIL_API_KEY: str = ""

    # Copilot / RAG
    COPILOT_PROVIDER: str = "disabled"
    COPILOT_API_KEY: str = ""
    COPILOT_LLM_PROVIDER: str = "disabled"  # "disabled"|"openai"|"ollama"|"google"
    COPILOT_LLM_BASE_URL: str = ""
    COPILOT_LLM_MODEL: str = ""
    VECTOR_STORE_PATH: str = "data/vector_store"
    KNOWLEDGE_BASE_DIR: str = "docs/copilot"

    # Feature Store & Model Registry
    FEATURE_STORE_DIR: str = "data/feature_store"
    MODEL_REGISTRY_DIR: str = "ml/artifacts"

    # Alert governance
    ALERT_APPROVAL_REQUIRED: bool = True  # Public alerts always need approval
    CAP_EXPORT_ENABLED: bool = True

    # Data mode guards & thresholds
    STALE_THRESHOLD_MINUTES: int = 60  # Data older than this is STALE
    DANGER_THRESHOLD_MINUTES: int = 180  # Data older than this is UNAVAILABLE

    # Scheduler
    SCHEDULER_ENABLED: bool = True
    INGEST_INTERVAL_MINUTES: int = 15

    # ML
    RISK_CONFIG_PATH: str = "ml/models/risk_config.json"

    # Map
    MAP_PROVIDER: str = "openstreetmap"
    MAP_PROVIDER_API_KEY: str = ""

    # Upload limits
    MAX_UPLOAD_SIZE_MB: int = 50
    UPLOAD_DIR: str = "data/uploads"

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_JSON: bool = False

    @field_validator("JWT_SECRET", mode="before")
    @classmethod
    def validate_jwt_secret(cls, v: str) -> str:
        if not v or len(v) < 32:
            return "dev_jwt_secret_change_in_production_min32chars_2026"
        return v

    @property
    def is_demo_mode(self) -> bool:
        return self.DEMO_MODE or self.DEFAULT_DATA_MODE == DataMode.DEMO

    @property
    def database_url_sync(self) -> str:
        return self.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")


settings = Settings()
