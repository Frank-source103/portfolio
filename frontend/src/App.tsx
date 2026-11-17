import React, { useState, useId, useMemo } from 'react';

// ============================================================================
// DESIGN TOKENS & DOMAIN DATA
// ============================================================================

export type ProjectDomain = 'all' | 'ai-rag' | 'concurrency' | 'systems';

export interface ArchitectureCircuit {
  ingress: string;
  processing: string;
  storage: string;
  concurrencyProof: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  domain: ProjectDomain;
  domainLabel: string;
  summary: string;
  tech: string[];
  status: 'Live' | 'Maintained';
  liveUrl?: string;
  codeUrl: string;
  circuit: ArchitectureCircuit;
  featured?: boolean;
}

const PROJECTS_DATA: ProjectRecord[] = [
  {
    id: 'coldoc',
    title: 'ColDoc — Multimodal PDF RAG with Inline Citations',
    domain: 'ai-rag',
    domainLabel: 'Multimodal AI & RAG',
    summary:
      'Retrieval-augmented generation system for balance sheets and financial PDFs. AI assertions embed interactive citations that programmatically scroll a custom PDF canvas to the exact source page and render animated bounding-box overlays.',
    tech: ['Next.js', 'FastAPI', 'Python', 'Claude API', 'PyMuPDF', 'TypeScript'],
    status: 'Live',
    liveUrl: 'https://coldoc.vercel.app',
    codeUrl: 'https://github.com/Frank-source103/coldoc',
    circuit: {
      ingress: 'Multipart PDF upload via FastAPI streaming endpoints with PyMuPDF layout analysis.',
      processing: 'Token coordinate mapping linking raw table geometry to LLM-generated citation anchors.',
      storage: 'Vector embeddings with coordinate-tagged metadata for bounding box reconstruction.',
      concurrencyProof: 'Non-blocking async document chunking with worker thread offloading.'
    },
    featured: true
  },
  {
    id: 'autoanalyst',
    title: 'AutoAnalyst — Autonomous Data-Science Agent',
    domain: 'ai-rag',
    domainLabel: 'Autonomous Agents',
    summary:
      'Autonomous agent with sandboxed code execution. Users provide tabular datasets (CSV/Parquet) and natural language queries; the engine iteratively plans analyses, profiles schemas, writes executable Python scripts, and returns interactive telemetry.',
    tech: ['Next.js', 'React', 'Python', 'FastAPI', 'Docker Sandbox', 'Pandas', 'Matplotlib'],
    status: 'Live',
    liveUrl: 'https://autoanalyst-frontend.vercel.app',
    codeUrl: 'https://github.com/Frank-source103/autoanalyst',
    circuit: {
      ingress: 'Streaming SSE interface supporting iterative query clarification and file ingestion.',
      processing: 'Autonomous self-healing Python execution loop with syntax error recovery.',
      storage: 'Ephemeral sandboxed file system mounted with strict read/write permission bounds.',
      concurrencyProof: 'Process isolation per user session with memory allocation ceilings.'
    },
    featured: false
  },
  {
    id: 'eventpass',
    title: 'EventPass — Concurrency-Safe Event Ticketing',
    domain: 'concurrency',
    domainLabel: 'Payments & Concurrency',
    summary:
      'Full-stack ticketing infrastructure with Paystack settlement, cryptographically signed QR-code generation, automated downloadable PDF tickets, and atomic inventory locks preventing overselling under traffic surges.',
    tech: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Paystack'],
    status: 'Live',
    liveUrl: 'https://event-ticketing-frontend-one.vercel.app',
    codeUrl: 'https://github.com/Frank-source103/event-ticketing',
    circuit: {
      ingress: 'HTTPS webhooks with signature verification validating Paystack transaction events.',
      processing: 'Atomic inventory decrement with database row locking eliminating race conditions.',
      storage: 'PostgreSQL relational schema with foreign key constraints and transactional integrity.',
      concurrencyProof: 'Serialized database transactions ensuring 0 inventory oversell during spikes.'
    },
    featured: false
  },
  {
    id: 'srms-v2',
    title: 'School Result Management System V2.0',
    domain: 'systems',
    domainLabel: 'Relational Systems',
    summary:
      'Academic records platform with role-based access control (RBAC), self-service student examination portal, automated cumulative GPA calculation engines, and official transcript generation.',
    tech: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    status: 'Live',
    liveUrl: 'https://school-result-management-system-one.vercel.app',
    codeUrl: 'https://github.com/frank-source103/school-result-management-system',
    circuit: {
      ingress: 'JWT bearer authentication separating administrative grading from student inspection.',
      processing: 'Server-side cumulative GPA evaluation engine replacing manual grade calculations.',
      storage: 'Normalized relational schema structuring courses, sessions, and enrollment cascades.',
      concurrencyProof: 'Strict RBAC middleware and sanitized SQL query parameterization.'
    },
    featured: false
  },
  {
    id: 'backend-api',
    title: 'Student Result Management API',
    domain: 'systems',
    domainLabel: 'API Engineering',
    summary:
      'Headless RESTful grading and course management service deployed on Render, featuring JWT session issuance, role authorization guards, and relational PostgreSQL storage.',
    tech: ['Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Render'],
    status: 'Live',
    codeUrl: 'https://github.com/frank-source103/Backend-API',
    circuit: {
      ingress: 'HTTP/1.1 REST endpoints with JSON payload validation and rate limits.',
      processing: 'Express router chains enforcing authentication headers and input sanitation.',
      storage: 'Managed PostgreSQL on Render connected via Prisma connection pooler.',
      concurrencyProof: 'Stateless JWT validation allowing horizontal service replication.'
    },
    featured: false
  },
  {
    id: 'contact-microservice',
    title: 'Contact Verification Microservice',
    domain: 'systems',
    domainLabel: 'Microservices',
    summary:
      'Lightweight edge backend microservice powering portfolio inquiries. Handles input schema validation, IP rate-limiting, honeypot traps, and transactional dispatch.',
    tech: ['Python', 'FastAPI', 'SQLite', 'Pydantic'],
    status: 'Live',
    codeUrl: 'https://github.com/frank-source103/portfolio',
    circuit: {
      ingress: 'JSON POST route with CORS origin restriction and honeypot field gating.',
      processing: 'Pydantic data validation model enforcing strict email RFC syntax compliance.',
      storage: 'SQLite local ledger with append-only logging for inbound messages.',
      concurrencyProof: 'Asynchronous event loop execution dispatching external SMTP payloads.'
    },
    featured: false
  }
];

// ============================================================================
// MAIN PORTFOLIO COMPONENT
// ============================================================================

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeDomain, setActiveDomain] = useState<ProjectDomain>('all');
  const [expandedCircuitId, setExpandedCircuitId] = useState<string | null>('coldoc');
  const [circuitStep, setCircuitStep] = useState<'ingress' | 'processing' | 'storage' | 'concurrencyProof'>('ingress');

  // Contact Form State Machine
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formFeedback, setFormFeedback] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeDomain === 'all') return PROJECTS_DATA;
    return PROJECTS_DATA.filter((p) => p.domain === activeDomain);
  }, [activeDomain]);

  // Active circuit project
  const activeCircuitProject = useMemo(() => {
    return PROJECTS_DATA.find((p) => p.id === expandedCircuitId) || PROJECTS_DATA[0];
  }, [expandedCircuitId]);

  // Copy email action
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('francium2008@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Submit contact
  const handleSubmitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormFeedback('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const honeypot = formData.get('website');

    if (honeypot) {
      // Honeypot silently rejected
      setFormStatus('success');
      setFormFeedback('Transmission recorded.');
      form.reset();
      return;
    }

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const apiBase = (typeof window !== 'undefined' && (window as any).API_URL)
      ? (window as any).API_URL
      : (import.meta.env.VITE_API_URL || 'https://portfolio-amlc.onrender.com');
    const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Service dispatch failure.');
      setFormStatus('success');
      setFormFeedback('Message verified and dispatched to Okay Frank.');
      form.reset();
    } catch (_err: unknown) {
      setFormStatus('error');
      setFormFeedback('Endpoint unreachable. Direct contact: francium2008@gmail.com');
    }
  };

  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  return (
    <div
      className={`min-h-screen transition-colors duration-150 font-sans ${
        theme === 'dark'
          ? 'bg-[#0C0E12] text-[#F1F4F9] selection:bg-[#F59E0B] selection:text-[#0C0E12]'
          : 'bg-[#F9FAFB] text-[#0C1017] selection:bg-[#D97706] selection:text-white'
      }`}
    >
      {/* =====================================================================
          1. SYSTEM HEADER & NAVIGATION
          ===================================================================== */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
          theme === 'dark'
            ? 'bg-[#0C0E12]/90 border-[#242933]'
            : 'bg-[#F9FAFB]/90 border-[#E2E6EE]'
        }`}
      >
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="font-serif italic text-lg sm:text-xl font-bold tracking-tight text-inherit"
              aria-label="Okay Frank portfolio home"
            >
              Okay Frank
            </span>
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] font-mono text-[11px] font-medium border ${
                theme === 'dark'
                  ? 'bg-[#15181E] border-[#242933] text-[#8F99A8]'
                  : 'bg-[#F1F3F7] border-[#E2E6EE] text-[#525D6F]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" aria-hidden="true" />
              Rivers, NG (UTC+1)
            </span>
          </div>

          <nav aria-label="Primary navigation" className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
            <a
              href="#systems"
              className={`transition-colors min-h-[44px] inline-flex items-center focus-visible:outline-2 focus-visible:outline-[#D97706] focus-visible:outline-offset-2 ${
                theme === 'dark' ? 'text-[#8F99A8] hover:text-[#F1F4F9]' : 'text-[#525D6F] hover:text-[#0C1017]'
              }`}
            >
              Systems
            </a>
            <a
              href="#architecture"
              className={`transition-colors min-h-[44px] inline-flex items-center focus-visible:outline-2 focus-visible:outline-[#D97706] focus-visible:outline-offset-2 ${
                theme === 'dark' ? 'text-[#8F99A8] hover:text-[#F1F4F9]' : 'text-[#525D6F] hover:text-[#0C1017]'
              }`}
            >
              Architecture
            </a>
            <a
              href="#about"
              className={`transition-colors min-h-[44px] inline-flex items-center focus-visible:outline-2 focus-visible:outline-[#D97706] focus-visible:outline-offset-2 ${
                theme === 'dark' ? 'text-[#8F99A8] hover:text-[#F1F4F9]' : 'text-[#525D6F] hover:text-[#0C1017]'
              }`}
            >
              Profile
            </a>
            <a
              href="#contact"
              className={`transition-colors min-h-[44px] inline-flex items-center focus-visible:outline-2 focus-visible:outline-[#D97706] focus-visible:outline-offset-2 ${
                theme === 'dark' ? 'text-[#8F99A8] hover:text-[#F1F4F9]' : 'text-[#525D6F] hover:text-[#0C1017]'
              }`}
            >
              Contact
            </a>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className={`min-h-[44px] px-3 py-1.5 rounded-[4px] font-mono text-xs font-semibold border transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#D97706] ${
                theme === 'dark'
                  ? 'bg-[#15181E] border-[#242933] text-[#F1F4F9] hover:border-[#384050]'
                  : 'bg-white border-[#E2E6EE] text-[#0C1017] hover:border-[#CBD2DE]'
              }`}
            >
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-[1120px] mx-auto px-4 sm:px-6">
        {/* =====================================================================
            2. HERO SECTION — DELIBERATE EDITORIAL STATEMENT
            ===================================================================== */}
        <section aria-labelledby="hero-title" className="py-16 sm:py-24 border-b border-[#242933]">
          <div className="max-w-[820px]">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-xs font-semibold tracking-wider text-[#D97706] uppercase">
                Systems &amp; Frontend Engineer
              </span>
              <span className="text-[#384050]" aria-hidden="true">
                /
              </span>
              <span
                className={`font-mono text-xs ${
                  theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'
                }`}
              >
                Full-Stack Architecture
              </span>
            </div>

            <h1
              id="hero-title"
              className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-inherit leading-[1.15] mb-6 text-balance"
            >
              Building resilient client interfaces backed by strict database schemas and concurrent execution.
            </h1>

            <p
              className={`text-base sm:text-lg leading-[1.65] mb-8 text-pretty max-w-[68ch] ${
                theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'
              }`}
            >
              I bridge frontend precision with backend operational discipline. Rather than building static mockups,
              I design complete software systems: multimodal RAG pipelines with coordinate-level citations,
              concurrency-safe checkout engines with Paystack webhooks, and normalized academic registries in PostgreSQL.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#systems"
                className="min-h-[44px] px-5 py-2.5 rounded-[4px] font-sans text-sm font-semibold text-white bg-[#D97706] hover:bg-[#B45309] active:scale-[0.98] transition-all inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#D97706] focus-visible:outline-offset-2"
              >
                Inspect production systems
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`min-h-[44px] px-4 py-2.5 rounded-[4px] font-mono text-xs font-medium border transition-all active:scale-[0.98] inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#D97706] focus-visible:outline-offset-2 ${
                  theme === 'dark'
                    ? 'bg-[#15181E] border-[#242933] text-[#F1F4F9] hover:border-[#384050]'
                    : 'bg-white border-[#E2E6EE] text-[#0C1017] hover:border-[#CBD2DE]'
                }`}
              >
                <span>francium2008@gmail.com</span>
                <span className="text-[#D97706] font-semibold">{copiedEmail ? '[COPIED]' : '[COPY]'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. SIGNATURE ELEMENT — ARCHITECTURE CIRCUIT TELEMETRY
            ===================================================================== */}
        <section id="architecture" aria-labelledby="arch-title" className="py-16 border-b border-[#242933]">
          <div className="mb-8">
            <div className="font-mono text-xs font-semibold tracking-wider text-[#D97706] uppercase mb-1">
              Operational Telemetry
            </div>
            <h2 id="arch-title" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Architecture Circuit Inspector
            </h2>
            <p className={`text-sm sm:text-base mt-2 ${theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'}`}>
              Select a system to inspect its end-to-end operational pipeline, transaction safety, and data flow.
            </p>
          </div>

          <div
            className={`rounded-[8px] border overflow-hidden transition-colors ${
              theme === 'dark' ? 'bg-[#13161C] border-[#242933]' : 'bg-white border-[#E2E6EE]'
            }`}
          >
            {/* System Selector Header */}
            <div
              className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                theme === 'dark' ? 'border-[#242933] bg-[#1A1E26]' : 'border-[#E2E6EE] bg-[#F1F3F7]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" aria-hidden="true" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Target: {activeCircuitProject.title.split('—')[0].trim()}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PROJECTS_DATA.slice(0, 4).map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setExpandedCircuitId(proj.id)}
                    className={`min-h-[44px] px-3 py-1.5 rounded-[4px] font-mono text-xs font-semibold border transition-all active:scale-[0.98] ${
                      expandedCircuitId === proj.id
                        ? 'bg-[#D97706] text-white border-[#D97706]'
                        : theme === 'dark'
                        ? 'bg-[#15181E] border-[#242933] text-[#8F99A8] hover:text-[#F1F4F9]'
                        : 'bg-white border-[#E2E6EE] text-[#525D6F] hover:text-[#0C1017]'
                    }`}
                  >
                    {proj.title.split('—')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Circuit Step Navigators */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#242933]">
              {(
                [
                  { key: 'ingress', label: '01. Ingress & Gate' },
                  { key: 'processing', label: '02. Logic & Engine' },
                  { key: 'storage', label: '03. Schema & Storage' },
                  { key: 'concurrencyProof', label: '04. Transaction Safety' }
                ] as const
              ).map((step) => (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => setCircuitStep(step.key)}
                  className={`min-h-[44px] p-3 text-start font-mono text-xs font-medium border-b-2 transition-all ${
                    circuitStep === step.key
                      ? 'border-[#D97706] text-[#D97706] bg-[#D97706]/5'
                      : theme === 'dark'
                      ? 'border-transparent text-[#8F99A8] hover:text-[#F1F4F9]'
                      : 'border-transparent text-[#525D6F] hover:text-[#0C1017]'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {/* Circuit Detail Panel */}
            <div className="p-6">
              <div
                className={`p-4 rounded-[4px] border font-mono text-xs sm:text-sm leading-relaxed ${
                  theme === 'dark' ? 'bg-[#0C0E12] border-[#242933] text-[#F1F4F9]' : 'bg-[#F9FAFB] border-[#E2E6EE] text-[#0C1017]'
                }`}
              >
                <div className="text-[#D97706] font-bold uppercase mb-2">
                  // {circuitStep.toUpperCase()} PIPELINE PROTOCOL
                </div>
                <p className="font-sans text-sm sm:text-base leading-normal">
                  {activeCircuitProject.circuit[circuitStep]}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <span className={`${theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'}`}>
                  Deployment status: <strong className="text-[#10B981] font-semibold">200 OK Live</strong>
                </span>
                {activeCircuitProject.liveUrl && (
                  <a
                    href={activeCircuitProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D97706] hover:underline font-semibold"
                  >
                    Launch active endpoint &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            4. PRODUCTION SYSTEMS DIRECTORY
            ===================================================================== */}
        <section id="systems" aria-labelledby="systems-title" className="py-16 border-b border-[#242933]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs font-semibold tracking-wider text-[#D97706] uppercase mb-1">
                Verified Deployments
              </div>
              <h2 id="systems-title" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                Production Software Systems
              </h2>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Filter systems by domain">
              {(
                [
                  { key: 'all', label: 'All Systems' },
                  { key: 'ai-rag', label: 'AI & RAG' },
                  { key: 'concurrency', label: 'Concurrency' },
                  { key: 'systems', label: 'Relational & APIs' }
                ] as const
              ).map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setActiveDomain(d.key)}
                  className={`min-h-[44px] px-3 py-1.5 rounded-[4px] font-mono text-xs font-semibold border transition-all active:scale-[0.98] ${
                    activeDomain === d.key
                      ? 'bg-[#D97706] text-white border-[#D97706]'
                      : theme === 'dark'
                      ? 'bg-[#15181E] border-[#242933] text-[#8F99A8] hover:text-[#F1F4F9]'
                      : 'bg-white border-[#E2E6EE] text-[#525D6F] hover:text-[#0C1017]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className={`rounded-[8px] border p-6 flex flex-col justify-between transition-all duration-150 ${
                  project.featured ? 'md:col-span-2' : ''
                } ${
                  theme === 'dark'
                    ? 'bg-[#13161C] border-[#242933] hover:border-[#384050]'
                    : 'bg-white border-[#E2E6EE] hover:border-[#CBD2DE]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-semibold text-[#D97706] uppercase">
                      {project.domainLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#10B981] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" aria-hidden="true" />
                      {project.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mb-3 text-balance">
                    {project.title}
                  </h3>

                  <p
                    className={`text-sm sm:text-base leading-relaxed mb-6 text-pretty ${
                      theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'
                    }`}
                  >
                    {project.summary}
                  </p>
                </div>

                <div>
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6" aria-label="Technologies used">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className={`font-mono text-xs px-2 py-0.5 rounded-[4px] border ${
                          theme === 'dark'
                            ? 'bg-[#1A1E26] border-[#242933] text-[#F1F4F9]'
                            : 'bg-[#F1F3F7] border-[#E2E6EE] text-[#0C1017]'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#242933]">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] px-4 py-2 rounded-[4px] font-sans text-xs font-semibold text-white bg-[#D97706] hover:bg-[#B45309] active:scale-[0.98] transition-all inline-flex items-center focus-visible:outline-2 focus-visible:outline-[#D97706]"
                      >
                        Launch endpoint &rarr;
                      </a>
                    )}
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`min-h-[44px] px-4 py-2 rounded-[4px] font-mono text-xs font-semibold border transition-all active:scale-[0.98] inline-flex items-center ${
                        theme === 'dark'
                          ? 'bg-[#1A1E26] border-[#242933] text-[#F1F4F9] hover:border-[#384050]'
                          : 'bg-[#F1F3F7] border-[#E2E6EE] text-[#0C1017] hover:border-[#CBD2DE]'
                      }`}
                    >
                      Repository
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================================
            5. PROFILE & ARCHITECTURAL FOUNDATION (ABOUT)
            ===================================================================== */}
        <section id="about" aria-labelledby="profile-title" className="py-16 border-b border-[#242933]">
          <div className="mb-8">
            <div className="font-mono text-xs font-semibold tracking-wider text-[#D97706] uppercase mb-1">
              Background &amp; Method
            </div>
            <h2 id="profile-title" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Engineering Foundations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Avatar & Quick Facts Telemetry */}
            <div className="md:col-span-4 flex flex-col items-center sm:items-start gap-4">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-[#D97706] bg-[#15181E] shadow-lg flex-shrink-0">
                <img
                  src="/photo.jpg"
                  alt="Portrait of Okay Frank"
                  width={176}
                  height={176}
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                className={`w-full p-4 rounded-[8px] border font-mono text-xs flex flex-col gap-3 ${
                  theme === 'dark' ? 'bg-[#13161C] border-[#242933]' : 'bg-white border-[#E2E6EE]'
                }`}
              >
                <div>
                  <span className="text-[#8F99A8] block text-[10px] uppercase">Base Station</span>
                  <span className="font-medium text-inherit">Rivers State, Nigeria (UTC+1)</span>
                </div>
                <div>
                  <span className="text-[#8F99A8] block text-[10px] uppercase">Core Toolchain</span>
                  <span className="font-medium text-inherit">React 19, TypeScript, Node.js, PostgreSQL, Prisma, FastAPI</span>
                </div>
                <div>
                  <span className="text-[#8F99A8] block text-[10px] uppercase">Primary Disciplines</span>
                  <span className="font-medium text-inherit">Design Systems, Concurrency Protection, Multimodal RAG</span>
                </div>
                <div>
                  <span className="text-[#8F99A8] block text-[10px] uppercase">Status</span>
                  <span className="text-[#10B981] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" aria-hidden="true" />
                    Open to full-time roles &amp; contracts
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Technical Narrative & Principles */}
            <div className="md:col-span-8 flex flex-col gap-6">
              <div
                className={`text-base leading-[1.7] space-y-4 max-w-[65ch] ${
                  theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'
                }`}
              >
                <p className="font-serif text-lg sm:text-xl font-normal leading-snug text-inherit">
                  I build web software with an uncompromising respect for data integrity and client responsiveness.
                </p>
                <p>
                  My engineering practice began with interface craft: building accessible, keyboard-traversable
                  layouts adhering strictly to 8-point spatial scales and token constraints. However, user interfaces
                  only matter when the underlying database and API boundaries behave predictably.
                </p>
                <p>
                  Today, I build full-stack systems across the entire application lifecycle. Whether engineering
                  atomic inventory checkout locks in PostgreSQL to eliminate ticket overselling during surges,
                  or building multimodal PDF citation viewports that link bounding-box coordinates to vector embeddings,
                  I prioritize predictability, observability, and sub-100ms feedback loops.
                </p>
              </div>

              {/* 3 Core Principles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#242933]">
                <div
                  className={`p-4 rounded-[4px] border ${
                    theme === 'dark' ? 'bg-[#13161C] border-[#242933]' : 'bg-white border-[#E2E6EE]'
                  }`}
                >
                  <div className="font-mono text-xs font-semibold text-[#D97706] mb-1">01 / CRAFT</div>
                  <h4 className="font-bold text-sm mb-1">Token Discipline</h4>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'}`}>
                    Strict scales, nested corner radii, and WCAG AA contrast by default. Zero arbitrary styling values.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-[4px] border ${
                    theme === 'dark' ? 'bg-[#13161C] border-[#242933]' : 'bg-white border-[#E2E6EE]'
                  }`}
                >
                  <div className="font-mono text-xs font-semibold text-[#D97706] mb-1">02 / INTEGRITY</div>
                  <h4 className="font-bold text-sm mb-1">Schema Reliability</h4>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'}`}>
                    Relational database constraints, cascading safety, atomic transactions, and server-side validation.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-[4px] border ${
                    theme === 'dark' ? 'bg-[#13161C] border-[#242933]' : 'bg-white border-[#E2E6EE]'
                  }`}
                >
                  <div className="font-mono text-xs font-semibold text-[#D97706] mb-1">03 / VELOCITY</div>
                  <h4 className="font-bold text-sm mb-1">Sub-100ms Feedback</h4>
                  <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'}`}>
                    Lean bundles, zero unnecessary dependencies, and instantaneous UI response on all devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. VERIFIED CONTACT FORM
            ===================================================================== */}
        <section id="contact" aria-labelledby="contact-title" className="py-16">
          <div className="max-w-[640px]">
            <div className="font-mono text-xs font-semibold tracking-wider text-[#D97706] uppercase mb-1">
              Direct Communication
            </div>
            <h2 id="contact-title" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Initiate Transmission
            </h2>
            <p className={`text-sm sm:text-base mb-8 ${theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'}`}>
              Send a direct message or inquiry to my local service. Messages are validated and dispatched immediately.
            </p>

            <form
              id="cf"
              onSubmit={handleSubmitContact}
              className={`p-6 rounded-[8px] border flex flex-col gap-4 ${
                theme === 'dark' ? 'bg-[#13161C] border-[#242933]' : 'bg-white border-[#E2E6EE]'
              }`}
            >
              {/* Anti-spam honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div>
                <label htmlFor={nameId} className="block font-mono text-xs font-medium uppercase mb-1.5">
                  Sender Identity (Name)
                </label>
                <input
                  id={nameId}
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  className={`w-full min-h-[44px] px-3 py-2 rounded-[4px] border font-sans text-sm transition-all focus-visible:outline-2 focus-visible:outline-[#D97706] ${
                    theme === 'dark'
                      ? 'bg-[#0C0E12] border-[#242933] text-[#F1F4F9] placeholder:text-[#525D6F]'
                      : 'bg-[#F9FAFB] border-[#E2E6EE] text-[#0C1017] placeholder:text-[#8F99A8]'
                  }`}
                />
              </div>

              <div>
                <label htmlFor={emailId} className="block font-mono text-xs font-medium uppercase mb-1.5">
                  Reply-To Coordinates (Email)
                </label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className={`w-full min-h-[44px] px-3 py-2 rounded-[4px] border font-sans text-sm transition-all focus-visible:outline-2 focus-visible:outline-[#D97706] ${
                    theme === 'dark'
                      ? 'bg-[#0C0E12] border-[#242933] text-[#F1F4F9] placeholder:text-[#525D6F]'
                      : 'bg-[#F9FAFB] border-[#E2E6EE] text-[#0C1017] placeholder:text-[#8F99A8]'
                  }`}
                />
              </div>

              <div>
                <label htmlFor={messageId} className="block font-mono text-xs font-medium uppercase mb-1.5">
                  Dispatch Message
                </label>
                <textarea
                  id={messageId}
                  name="message"
                  required
                  rows={4}
                  placeholder="Outline the operational scope, architectural challenge, or role specifications..."
                  className={`w-full min-h-[120px] p-3 rounded-[4px] border font-sans text-sm transition-all focus-visible:outline-2 focus-visible:outline-[#D97706] ${
                    theme === 'dark'
                      ? 'bg-[#0C0E12] border-[#242933] text-[#F1F4F9] placeholder:text-[#525D6F]'
                      : 'bg-[#F9FAFB] border-[#E2E6EE] text-[#0C1017] placeholder:text-[#8F99A8]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="min-h-[44px] px-6 py-2.5 rounded-[4px] font-sans text-sm font-semibold text-white bg-[#D97706] hover:bg-[#B45309] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:outline-2 focus-visible:outline-[#D97706] focus-visible:outline-offset-2"
                >
                  {formStatus === 'loading' ? 'Verifying payload...' : 'Dispatch Message &rarr;'}
                </button>

                <div
                  id="cf-status"
                  role="status"
                  aria-live="polite"
                  className={`font-mono text-xs font-medium ${
                    formStatus === 'error' ? 'text-[#EF4444]' : 'text-[#10B981]'
                  }`}
                >
                  {formFeedback}
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* =====================================================================
            7. COMPONENT STATE GALLERY (VERIFICATION AUDIT)
            ===================================================================== */}
        <section
          aria-labelledby="gallery-title"
          className={`my-16 p-6 rounded-[8px] border ${
            theme === 'dark' ? 'bg-[#15181E] border-[#242933]' : 'bg-[#F1F3F7] border-[#E2E6EE]'
          }`}
        >
          <div className="font-mono text-xs font-bold text-[#D97706] uppercase mb-1">Engineering Quality Spec</div>
          <h2 id="gallery-title" className="font-serif text-xl font-bold mb-4">
            Component State Verification Gallery
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded border border-[#242933] bg-[#0C0E12]">
              <span className="text-[#8F99A8] block text-[10px]">STATE 01</span>
              <strong className="text-white">Default</strong>
              <div className="mt-2 min-h-[36px] bg-[#D97706] text-white flex items-center justify-center rounded">
                Action
              </div>
            </div>
            <div className="p-3 rounded border border-[#242933] bg-[#0C0E12]">
              <span className="text-[#8F99A8] block text-[10px]">STATE 02</span>
              <strong className="text-white">Hover / Focus</strong>
              <div className="mt-2 min-h-[36px] bg-[#B45309] ring-2 ring-[#D97706] text-white flex items-center justify-center rounded">
                Hovered
              </div>
            </div>
            <div className="p-3 rounded border border-[#242933] bg-[#0C0E12]">
              <span className="text-[#8F99A8] block text-[10px]">STATE 03</span>
              <strong className="text-white">Active (Tactile)</strong>
              <div className="mt-2 min-h-[36px] bg-[#92400E] scale-[0.98] text-white flex items-center justify-center rounded">
                Scale 0.98
              </div>
            </div>
            <div className="p-3 rounded border border-[#242933] bg-[#0C0E12]">
              <span className="text-[#8F99A8] block text-[10px]">STATE 04</span>
              <strong className="text-white">Disabled</strong>
              <div className="mt-2 min-h-[36px] bg-[#384050] opacity-50 cursor-not-allowed text-[#8F99A8] flex items-center justify-center rounded">
                Disabled
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          8. FOOTER
          ===================================================================== */}
      <footer
        className={`border-t py-8 transition-colors ${
          theme === 'dark' ? 'border-[#242933] bg-[#0C0E12]' : 'border-[#E2E6EE] bg-[#F9FAFB]'
        }`}
      >
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <p className={`${theme === 'dark' ? 'text-[#8F99A8]' : 'text-[#525D6F]'}`}>
            &copy; {new Date().getFullYear()} Okay Frank. Built with React + TypeScript + strict CSS tokens.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Frank-source103"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D97706] hover:underline"
            >
              GitHub / Frank-source103
            </a>
            <a href="tel:+2348147077152" className="text-inherit hover:underline">
              +234 814 707 7152
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}