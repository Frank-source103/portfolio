# Portfolio Contact API

A lightweight, production-ready microservice built with **FastAPI**, **SQLite**, and **Resend** to handle contact form inquiries for [Okay Frank's portfolio](https://github.com/Frank-source103/portfolio).

---

## Features

- **Schema Validation**: Strongly-typed request payloads via Pydantic (`EmailStr`, length constraints, automatic whitespace trimming).
- **Honeypot Protection**: Silent dropping of automated spam submissions that populate the hidden `website` field.
- **In-Memory Rate Limiting**: Per-IP throttling allowing up to 5 submissions per hour.
- **Persistent Storage**: Automatic SQLite schema initialization with message logging (`id`, `name`, `email`, `message`, `ip`, `created_at`).
- **Email Forwarding**: Asynchronous email delivery via the Resend HTTP API (`https://api.resend.com/emails`).
- **Secure Message Retrieval**: Protected administrative endpoint with constant-time token comparison (`secrets.compare_digest`).

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Health check for uptime monitoring and portfolio badge | No |
| `POST` | `/api/contact` | Submits a contact inquiry | No (Subject to rate limits) |
| `GET` | `/api/messages` | Retrieves the last 100 logged messages | Yes (`X-Admin-Token` header) |

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Example |
|---|---|---|
| `RESEND_API_KEY` | Resend API key for outbound notifications | `re_abc123...` |
| `MAIL_TO` | Inbox where contact inquiries are received | `francium2008@gmail.com` |
| `MAIL_FROM` | Sender identity | `Portfolio <onboarding@resend.dev>` |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowed domains | `http://localhost:3000,https://your-portfolio.vercel.app` |
| `ADMIN_TOKEN` | Secure token required to query `/api/messages` | Random string |
| `DB_PATH` | Path to SQLite database file | `messages.db` |

---

## Running Locally

```bash
# 1. Setup virtual environment
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start server
uvicorn main:app --reload --port 8000
```

Interactive API documentation (Swagger UI) is available at:
`http://localhost:8000/docs`
