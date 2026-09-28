import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    local_model_enabled: bool = os.getenv("LOCAL_MODEL_ENABLED", "false").lower() == "true"
    local_model_name: str = os.getenv("LOCAL_MODEL_NAME", "MBZUAI/LaMini-Flan-T5-783M")
    max_output_tokens: int = int(os.getenv("MAX_OUTPUT_TOKENS", "2048"))
    temperature: float = float(os.getenv("TEMPERATURE", "0.3"))


settings = Settings()
