from ai_client import generate_text


def get_learning_recommendations(topic: str, level: str = "beginner") -> str:
    prompt = f"""Create a personalized learning path for the topic below.
Learner level: {level}
Organize it from foundational to advanced concepts.
For each stage include what to learn, a practical activity, and a realistic time estimate.
Also suggest useful resource types (videos, official documentation, books, practice sites).
Do not invent specific URLs.
Finish with a small project or assessment idea.

Topic: {topic}
"""
    return generate_text(prompt)
