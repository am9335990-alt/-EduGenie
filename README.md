# EduGenie — Google Gemini Powered Learning Assistant

EduGenie is a lightweight educational assistant based on the supplied project documentation. It provides Q&A, beginner-friendly explanations, quiz generation, passage summarization, and personalized learning paths through a FastAPI backend and HTML/CSS/JavaScript frontend.

## Architecture

```text
Browser
  |
  v
HTML/CSS/JS frontend
  |
  v
FastAPI REST API
  |---- /qa ------------------------> Gemini
  |---- /explain --------------------> Gemini
  |---- /quiz -----------------------> Gemini -> JSON validation
  |---- /summarize ------------------> Gemini
  |---- /learn/recommendations ------> Gemini
  |
  +---- optional local_explainer.py -> LaMini-Flan-T5-783M
```

## Requirements

- Python 3.10+
- A Google Gemini API key
- VS Code (recommended)

## Windows setup

Open the project folder in VS Code, then run:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
```

Open `.env` and replace `your_gemini_api_key_here` with your key.

Start the server:

```powershell
python -m uvicorn main:app --reload
```

Open http://127.0.0.1:8000

## macOS/Linux setup

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn main:app --reload
```

## API endpoints

- `POST /qa` — `{ "text": "Which is the largest ocean?" }`
- `POST /explain` — `{ "topic": "Pythagoras theorem" }`
- `POST /quiz` — `{ "text": "...", "count": 3 }`
- `POST /summarize` — `{ "text": "..." }`
- `POST /learn/recommendations` — `{ "topic": "SQL", "level": "beginner" }`
- `GET /health` — service health check

Interactive API docs are available at http://127.0.0.1:8000/docs

## Testing

With the virtual environment active:

```bash
pytest -q
```

The tests validate the API surface and input handling without making paid/external Gemini calls.

## Optional local LaMini model

The supplied documentation describes `MBZUAI/LaMini-Flan-T5-783M` for concept explanations. This implementation keeps that model optional because it requires downloading model weights and an ML runtime. To enable it, uncomment `transformers` and `torch` in `requirements.txt`, install them, and set:

```env
LOCAL_MODEL_ENABLED=true
```

The main application continues to use Gemini for the documented cloud tasks.
