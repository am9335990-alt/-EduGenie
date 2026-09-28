from ai_client import generate_text
from config import settings


def explain_topic(topic: str) -> str:
    if settings.local_model_enabled:
        try:
            from local_explainer import explain_with_local_model
            return explain_with_local_model(topic)
        except Exception:
            # Keep the application usable if the optional local model is unavailable.
            pass

    prompt = f"""Explain the following topic for a beginner student.
Structure the answer with: Simple definition, How it works, Example, Key points.
Keep the explanation clear, readable, and not unnecessarily long.

Topic: {topic}
"""
    return generate_text(prompt)
