from ai_client import generate_text


def summarize_text(text: str) -> str:
    prompt = f"""Summarize the educational passage below for quick revision.
Preserve the important facts and concepts. Remove repetition.
Use a short overview followed by bullet points when useful.
Do not add information that is not supported by the passage.

Passage:
{text}
"""
    return generate_text(prompt)
