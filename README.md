# Portfolio: site + contact API

```
frontend/index.html   the portfolio page (form posts to the API)
frontend/config.js    where you set the API URL
frontend/photo.jpg    your headshot
backend/main.py       FastAPI service: validate, save to SQLite, email via Resend
```

## 1. Run it locally
```bash
cd backend
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                  # then edit the values
uvicorn main:app --reload --port 8000
```
Open `frontend/index.html` with VS Code Live Server (port 5500) and send a test message.
Interactive API docs: http://localhost:8000/docs

## 2. Email (Resend)
Create a Resend account, make an API key, and put it in `RESEND_API_KEY`.
The test sender `onboarding@resend.dev` normally only delivers to your own account email,
which is what you want for now. Check Resend's docs for current limits, and verify a domain
later if you want a custom sender address.
If email fails, the message is still saved in the database.

## 3. Deploy the API (Render or Railway)
- Push this folder to GitHub.
- Create a Web Service from the repo with root directory `backend`.
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add the environment variables from `.env.example` in the dashboard.
  Set `ALLOWED_ORIGINS` to your real site URL (no trailing slash).
- Free disks are often wiped on redeploy, so the SQLite file may reset. Email still reaches you.
  For lasting storage, attach a persistent disk/volume and point `DB_PATH` at it,
  or move the table to a hosted Postgres.

## 4. Deploy the site (Vercel or Netlify)
- In `frontend/config.js`, set `API_URL` to your deployed API URL.
- Deploy the `frontend` folder. Then update `ALLOWED_ORIGINS` on the API to match the site URL.

## 5. Read saved messages
```bash
curl -H "X-Admin-Token: YOUR_TOKEN" https://YOUR-API-URL/api/messages
```

## Security notes
- Never commit `.env`. Keep keys only in environment variables.
- The honeypot field and per-IP limit stop basic spam; the limit is in memory and resets on restart.
- CORS only allows the origins you list.
