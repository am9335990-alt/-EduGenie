from ai_client import generate_text


def answer_question(question: str) -> str:
    prompt = f"""You are EduGenie, a friendly educational assistant.
Answer the student's question accurately and concisely.
Use simple language, explain important terms, and use short examples when helpful.
Do not invent citations or claim certainty when the question is ambiguous.

Student question:
{question}

Answer:"""
    return generate_text(prompt)
