# Okay Frank — Portfolio & Contact API

A high-performance, accessible, and editorial portfolio site engineered for technical recruiters and engineering managers. Built with clean semantic HTML, modular CSS tokens, native Canvas motion, and a lightweight Python FastAPI microservice.

---

## Architecture Overview

The repository is structured as a decoupled full-stack project:

```
├── frontend/
│   ├── index.html          # Portfolio application (semantic HTML, CSS tokens, dynamic JS)
│   ├── config.js           # API URL configuration (bridges frontend to deployed backend)
│   └── photo.jpg           # Profile image
├── backend/
│   ├── main.py             # FastAPI service (validation, SQLite persistence, Resend email)
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Environment variable template
│   └── .gitignore          # Backend-specific ignore rules
├── .gitignore              # Root git ignore rules
└── README.md               # Project documentation
```

---

## Key Features

### Frontend
- **Editorial Design System**:
  - **Typography**: Bricolage Grotesque (headings, tight tracking), Inter (body readability), and JetBrains Mono (code accents, metadata).
  - **Palette**: Refined neutral tones in light mode (`#F7F6F2` bg, `#14171F` text) and dark mode (`#0E1116` bg, `#ECEDEF` text) paired with a high-contrast royal blue accent (`#2F5BFF` / `#6B8CFF`). All text combinations strictly exceed WCAG AA contrast standards (≥ 4.5:1).
  - **Deterministic Geometry**: Consistent 12px border radius across all cards, buttons, inputs, and frames. Strict 8-point spacing scale (`4px` to `96px`).
- **Accessible Motion System**:
  - Interactive hero canvas featuring code glyphs (`{ } </> => ; #`) in JetBrains Mono that trail the cursor and fade out.
  - Physics-based magnetic buttons (< 96px radius) and 3D card tilt (capped at 6°).
  - Complete zero-animation fallback under `prefers-reduced-motion: reduce` and on touch devices (`pointer: coarse`).
- **Dynamic Projects Architecture**:
  - Single data array powering all project cards with zero empty link buttons.
  - Featured full-width showcase for **School Result Management System V2.0** with an expandable architectural decisions breakdown (PostgreSQL schema, GPA classification engine, RBAC access control).
  - Varied, asymmetric multi-column grid layout (7+5, 5+7, 6+6) preventing repetitive card patterns.
- **Production Polish**:
  - Real-time API health monitor querying `GET /health` with visual status feedback.
  - One-click email clipboard copy with instant micro-interaction confirmation.
  - Open Graph and Twitter Card social preview metadata with an embedded SVG favicon.

### Backend (`/backend`)
- **FastAPI Microservice**: Fast, typed REST API handling incoming contact form inquiries.
- **Anti-Spam & Protection**:
  - Hidden honeypot field filtering automated bot submissions silently.
  - In-memory sliding-window rate limiter (5 submissions per IP per hour).
  - Strict CORS origin filtering.
- **Storage & Delivery**:
  - Thread-safe SQLite persistence (`messages.db`) recording timestamps, client IP, sender details, and message bodies.
  - Asynchronous transactional email dispatch via the Resend API with automatic retry and error isolation.
  - Protected administrative audit endpoint (`GET /api/messages`) guarded by bearer token verification.

---

## Local Development

### Prerequisites
- Node.js (or any static HTTP server) for the frontend
- Python 3.10+ for the backend

### 1. Run the Backend API
```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate       # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your RESEND_API_KEY and MAIL_TO address

# Launch API server
uvicorn main:app --reload --port 8000
```
Interactive Swagger documentation is available at `http://localhost:8000/docs`.

### 2. Run the Frontend
You can serve the `frontend/` folder using any static server:

```bash
# Using npx serve
npx serve frontend -l 3000

# Or using Python's built-in server
cd frontend
python -m http.server 3000
```

Open `http://localhost:3000` in your browser.

---

## Deployment

### Frontend (Vercel or Netlify)
1. Link your repository and set the root directory to `frontend`.
2. Ensure `frontend/config.js` points to your production backend URL (e.g., `https://portfolio-amlc.onrender.com`).
3. Deploy.

### Backend (Render or Railway)
1. Create a Web Service pointing to your repository with root directory `backend`.
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Configure environment variables in your deployment dashboard:
   - `ALLOWED_ORIGINS`: Your production frontend URL (no trailing slash).
   - `RESEND_API_KEY`: Your Resend API token.
   - `MAIL_TO`: Destination email address for inquiries.
   - `ADMIN_TOKEN`: Secret token for reading stored inquiries.

---

## Security Best Practices
- Never commit `.env` or database files (`.db`).
- Rate limiting and honeypot protections prevent basic spam and connection exhaustion.
- CORS restricts form submissions exclusively to authorized domain origins.
