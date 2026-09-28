"""Optional local LaMini-Flan-T5 explanation backend.

The project keeps this separate because the model download is large. Set
LOCAL_MODEL_ENABLED=true to use it where the required ML packages are installed.
"""

from config import settings

_pipeline = None


def explain_with_local_model(topic: str) -> str:
    global _pipeline
    if not settings.local_model_enabled:
        raise RuntimeError("Local model is disabled. Set LOCAL_MODEL_ENABLED=true to enable it.")
    try:
        from transformers import pipeline
    except ImportError as exc:
        raise RuntimeError("Install transformers and torch to enable the local model.") from exc

    if _pipeline is None:
        _pipeline = pipeline("text2text-generation", model=settings.local_model_name)
    prompt = f"Explain {topic} simply for a beginner student. Give a definition and one example."
    result = _pipeline(prompt, max_new_tokens=250, do_sample=False)
    return result[0]["generated_text"].strip()
