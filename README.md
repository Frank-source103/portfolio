# Okay Frank — Portfolio & Contact API

A high-performance, accessible, and editorial portfolio site engineered for technical recruiters and engineering managers. Built with modern **React 18 + TypeScript + Vite + Tailwind CSS**, paired with a lightweight Python FastAPI microservice.

---

## Architecture Overview

The repository is structured as a decoupled full-stack project:

```
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # Main React portfolio component (architecture circuits, projects, about, contact)
│   │   ├── main.tsx         # React DOM mounting entry point
│   │   ├── index.css        # Tailwind directives and accessible base styles
│   │   └── vite-env.d.ts    # Vite environment type declarations
│   ├── public/
│   │   ├── photo.jpg        # Profile image (circular display)
│   │   └── config.js        # Runtime API endpoint configuration
│   ├── index.html           # Vite HTML application shell
│   ├── package.json         # React, Vite, and Tailwind dependencies
│   ├── vite.config.ts       # Vite bundling and dev server configuration
│   ├── tailwind.config.js   # Tailwind custom typography and color tokens
│   ├── postcss.config.js    # PostCSS configuration
│   ├── tsconfig.json        # TypeScript project configuration
│   └── index.legacy.html    # Backup of legacy standalone HTML file
├── backend/
│   ├── main.py              # FastAPI service (validation, SQLite persistence, Resend email)
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variable template
│   └── .gitignore           # Backend-specific ignore rules
├── package.json             # Root monorepo script runner
├── .gitignore               # Root git ignore rules
└── README.md                # Project documentation
```

---

## Key Features

### Frontend (React + TypeScript + Tailwind)
- **Editorial Design System**:
  - **Typography**: Newsreader (editorial serif headings), Geist / Inter (body readability), and JetBrains Mono (concurrency circuits, metadata, HTTP status codes).
  - **Color Tokens**: Industrial Steel ramp (`#0C0E12` to `#2E3543`) with deliberate Signal Ochre accents (`#D97706`). Strictly adheres to WCAG AA contrast (≥ 4.5:1).
  - **Cropped Circular Photo**: Profile picture framed in a 1:1 circular aspect ratio with a subtle ring.
  - **Quick Facts Spec Sheet**: Location: **Rivers, Nigeria (UTC+1)**, availability status, and core engineering principles.
- **Projects & Concurrency Inspector**:
  - Filterable by domain: *All Systems*, *Multimodal AI & RAG*, *Concurrency & Transactions*, *Relational Systems*.
  - **ColDoc**: Multimodal PDF RAG with inline citations (`https://coldoc.vercel.app`).
  - **AutoAnalyst**: Autonomous data-science agent with sandboxed Python execution (`https://autoanalyst-frontend.vercel.app`).
  - **EventPass**: Concurrency-safe event ticketing with Paystack integration and atomic locks (`https://event-ticketing-frontend-one.vercel.app`).
  - **School Result Management System V2.0**: Academic grading engine and RBAC portal (`https://school-result-management-system-one.vercel.app`).
  - **Interactive Architecture Circuit Inspector**: Interactive breakdown of *Ingress*, *Processing*, *Storage*, and *Concurrency Proof* per system.
- **Production Polish**:
  - Seamless Dark/Light mode theme toggle with localStorage persistence.
  - Contact form with resilient API fallback, honeypot anti-spam protection, and copy-email micro-interactions.
  - Full `@media (prefers-reduced-motion: reduce)` compliance.

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
- Node.js 18+ and npm
- Python 3.10+ (for backend development)

### 1. Run the Frontend (React + Vite)
From the repository root:
```bash
# Start local Vite development server
npm run dev

# Or directly from the frontend directory:
cd frontend
npm run dev
```
Open **`http://localhost:3000`** in your browser.

To create an optimized production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

### 2. Run the Backend API (Optional)
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

---

## Deployment

### Frontend (Vercel or Netlify)
1. Link your repository.
2. If setting the Root Directory to `frontend`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. If building from repository root:
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
4. Deploy!

### Backend (Render or Railway)
1. Create a Web Service pointing to your repository with root directory `backend`.
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Configure environment variables in your deployment dashboard:
   - `ALLOWED_ORIGINS`: Your production frontend URL (no trailing slash).
   - `RESEND_API_KEY`: Your Resend API token.
   - `MAIL_TO`: Destination email address for inquiries.
   - `ADMIN_TOKEN`: Secret token for reading stored inquiries.
