"""Contact-form API for the portfolio: validate, save to SQLite, email via Resend."""
import logging
import os
import secrets
import sqlite3
import time
from collections import defaultdict, deque
from contextlib import closing

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, EmailStr, Field

load_dotenv()
log = logging.getLogger("contact")

DB_PATH = os.getenv("DB_PATH", "messages.db")
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
MAIL_TO = os.getenv("MAIL_TO", "")
MAIL_FROM = os.getenv("MAIL_FROM", "Portfolio <onboarding@resend.dev>")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
ORIGINS = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500").split(",")
    if o.strip()
]
LIMIT, WINDOW = 5, 3600  # max 5 messages per IP per hour

app = FastAPI(title="Portfolio contact API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-Admin-Token"],
)


def db():
    return closing(sqlite3.connect(DB_PATH))


def init_db():
    with db() as con:
        con.execute(
            "CREATE TABLE IF NOT EXISTS messages ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, "
            "message TEXT NOT NULL, ip TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP)"
        )
        con.commit()


init_db()
hits = defaultdict(deque)


class Contact(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=10, max_length=3000)
    website: str = ""  # honeypot: real visitors never fill this in


def client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limited(ip: str) -> bool:
    now, q = time.time(), hits[ip]
    while q and now - q[0] > WINDOW:
        q.popleft()
    if len(q) >= LIMIT:
        return True
    q.append(now)
    return False


async def send_email(c: Contact) -> None:
    if not (RESEND_API_KEY and MAIL_TO):
        log.warning("Email not configured; message saved only.")
        return
    payload = {
        "from": MAIL_FROM,
        "to": [MAIL_TO],
        "reply_to": c.email,
        "subject": "Portfolio message from " + " ".join(c.name.split()),
        "text": f"From: {c.name} <{c.email}>\n\n{c.message}",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
                json=payload,
            )
            r.raise_for_status()
    except httpx.HTTPError:
        log.exception("Email failed; the message is still saved.")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/contact")
async def contact(data: Contact, request: Request):
    if data.website:  # bot filled the hidden field: pretend success, store nothing
        return {"ok": True}
    ip = client_ip(request)
    if rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many messages. Try again later.")
    with db() as con:
        con.execute(
            "INSERT INTO messages (name, email, message, ip) VALUES (?, ?, ?, ?)",
            (data.name, data.email, data.message, ip),
        )
        con.commit()
    await send_email(data)
    return {"ok": True}


@app.get("/api/messages")
def messages(x_admin_token: str = Header(default="")):
    ok = ADMIN_TOKEN and secrets.compare_digest(x_admin_token.encode(), ADMIN_TOKEN.encode())
    if not ok:
        raise HTTPException(status_code=404)
    with db() as con:
        con.row_factory = sqlite3.Row
        rows = con.execute("SELECT * FROM messages ORDER BY id DESC LIMIT 100").fetchall()
    return [dict(r) for r in rows]
