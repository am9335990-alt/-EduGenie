from fastapi.testclient import TestClient
import main

client = TestClient(main.app)


def test_homepage():
    response = client.get("/")
    assert response.status_code == 200
    assert "EduGenie" in response.text


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_validation_rejects_empty_question():
    response = client.post("/qa", json={"text": ""})
    assert response.status_code == 422


def test_quiz_validation_rejects_invalid_count():
    response = client.post("/quiz", json={"text": "test", "count": 11})
    assert response.status_code == 422
