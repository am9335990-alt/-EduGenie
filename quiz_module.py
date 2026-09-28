from ai_client import generate_json


def generate_quiz(text: str, count: int = 3):
    prompt = f"""Create exactly {count} multiple-choice questions from the passage below.
Return ONLY valid JSON in this shape:
{{"questions":[{{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}}]}}
The answer field must be the zero-based index of the correct option.
Each question must have exactly four options. Distractors should be plausible.
Use only information supported by the passage.

Passage:
{text}
"""
    result = generate_json(prompt)
    if not isinstance(result, dict) or not isinstance(result.get("questions"), list):
        raise RuntimeError("Quiz response did not contain a questions array.")
    questions = result["questions"]
    if len(questions) != count:
        raise RuntimeError(f"Expected {count} questions but received {len(questions)}.")
    for q in questions:
        if not isinstance(q, dict) or len(q.get("options", [])) != 4:
            raise RuntimeError("Quiz response contains an invalid question format.")
        if not isinstance(q.get("answer"), int) or not 0 <= q["answer"] < 4:
            raise RuntimeError("Quiz response contains an invalid answer index.")
    return questions
