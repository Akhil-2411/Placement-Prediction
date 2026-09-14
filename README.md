# PlaceIQ — AI-Powered Campus Placement Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Scikit-Learn](https://img.shields.io/badge/Scikit_Learn-Balanced_LogReg-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org)

**PlaceIQ** is a production-grade campus placement intelligence platform designed to help students, placement officers (TPOs), and college administrators evaluate placement readiness through explainable machine learning.

The platform executes a balanced **Logistic Regression** model trained on **100,000+ historical student records**, providing calibrated placement probabilities, mathematical log-odds factor attribution, prioritized skill gap roadmaps, and real-time company drive eligibility verification.

---

## Key Features

### For Students
- **16-Feature Placement Assessment:** Enter verified academic metrics, coding ratings, DSA mastery, system design, arrears, internships, certifications, and hackathons.
- **Calibrated Prediction Engine:** Generates placement probability percentage, binary classification (Placed / Not Placed), risk tier, and cohort standing percentile.
- **Log-Odds Factor Attribution:** Decomposes positive drivers (e.g. CGPA, DSA, Internships) and negative risk factors (Arrears, Tier constraints) with mathematical rigour.
- **Multi-Dimensional Skill Radar:** Visualizes profile strengths and gaps across 6 dimensions against placed candidate benchmarks.
- **Prioritized Actionable Roadmap:** Delivers high/medium/low action plans to clear bottlenecks before corporate drive registrations.
- **Campus Drive Matcher:** Live checks eligibility criteria (minimum CGPA, backlog tolerances, shortlisted disciplines) for companies like Google, Microsoft, Amazon, Oracle, and TCS.
- **Assessment History:** Tracks score progression across multiple assessment attempts over time.

### For Placement Officers & Administrators
- **Cohort Readiness Analytics:** Real-time visibility into overall batch placement likelihood and at-risk student headcounts.
- **Department-Wise Benchmarks:** Grouped comparison of placement conversion rates across CSE, IT, ECE, EE, ME, Chemical, and CE disciplines.
- **Risk Distribution:** Donut distribution of High Readiness (>75%), Moderate (50-75%), and At-Risk (<50%) student segments.
- **Filterable Student Directory:** Search, sort, and filter candidate rosters by branch, risk tier, arrears, and GPA with CSV export.
- **Drive Management:** Post and configure campus recruitment drives with specific cutoff criteria.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS | High-performance, fully typed modern client UI |
| **Data Viz** | Recharts, SVG Gauges | Factor attribution waterfalls, radar charts, progression curves |
| **Backend** | FastAPI, Uvicorn, Pydantic v2 | High-concurrency async REST API & input validation |
| **Machine Learning** | Scikit-Learn, Joblib, NumPy, Pandas | Balanced Logistic Regression model with 22 one-hot features |
| **Database & Auth** | Supabase (PostgreSQL 17), RLS | Secure relational storage, user profiles, and JWT authentication |
| **Deployment** | Docker, Docker Compose, Vercel, Render | Containerized local and multi-cloud production architecture |

---

## Project Structure

```
Placement-Prediction/
├── frontend/                     # React + TypeScript + Vite Client
│   ├── src/
│   │   ├── components/           # Reusable UI, Charts, Forms & Layouts
│   │   │   ├── charts/           # ProbabilityGauge, FactorWaterfall, SkillRadar
│   │   │   ├── forms/            # Multi-step AssessmentForm with presets
│   │   │   ├── layout/           # Navbar, Footer
│   │   │   └── ui/               # StatCard KPI widgets
│   │   ├── context/              # AuthContext (Supabase + Instant Demo Switcher)
│   │   ├── lib/                  # Supabase client, API client, utilities
│   │   ├── pages/                # Landing, Login, Register, Dashboard, Assessment, Results, History, Companies, Officer
│   │   └── types/                # TypeScript schemas for student profiles & predictions
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend/                      # FastAPI Machine Learning Service
│   ├── app/
│   │   ├── api/v1/endpoints/     # Predict, Analytics, Eligibility, Companies
│   │   ├── core/                 # App configuration & environment settings
│   │   ├── ml/                   # Inference pipeline & log-odds explainability
│   │   ├── schemas/              # Pydantic v2 validation models
│   │   ├── services/             # Prediction, Eligibility & Recommendation services
│   │   └── main.py               # FastAPI application entrypoint with lifespan startup
│   ├── models/
│   │   └── placement_model_balanced.joblib  # Trained Scikit-Learn model
│   ├── tests/                    # Unit tests & API integration test suite
│   ├── Dockerfile
│   └── requirements.txt
│
├── supabase/
│   └── migrations/               # PostgreSQL schema, triggers & RLS policies
│       └── 20260907_init_schema.sql
│
├── docs/                         # Comprehensive Engineering Documentation
│   ├── PRD.md
│   ├── TRD.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- (Optional) Docker & Docker Compose

### 1. Run with Docker Compose (Fastest)
```bash
docker-compose up --build
```
- Client App: [http://localhost:5173](http://localhost:5173)
- FastAPI Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Manual Local Setup

#### Backend (FastAPI)
```bash
# From repository root
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend will start on `http://127.0.0.1:8000`. Test health at `http://127.0.0.1:8000/health`.

#### Frontend (React + Vite)
```bash
# In a new terminal window
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Testing

Run the automated backend test suite:
```bash
python backend/tests/run_tests.py
```

Run frontend typecheck and production build:
```bash
cd frontend
npm run build
```

---

## Machine Learning Methodology

The model `placement_model_balanced.joblib` employs class-weighted Logistic Regression:
$$P(\text{Placed}) = \frac{1}{1 + e^{-z}}, \quad \text{where } z = w_0 + \sum_{i=1}^{22} w_i x_i$$

- **Exact 22-Feature Ordering:**
  `[cgpa, backlogs, coding_skills, dsa_score, aptitude_score, communication_skills, ml_knowledge, system_design, internships, projects_count, certifications, hackathons, open_source_contributions, extracurriculars, branch_CSE, branch_Chemical, branch_ECE, branch_EE, branch_IT, branch_ME, college_tier_Tier-2, college_tier_Tier-3]`
- **Attribution Formulation:** Each feature's relative impact is evaluated as $\Delta z_i = w_i \cdot (x_i - \bar{x}_i)$, where $\bar{x}_i$ is the population baseline mean from the 100,000 training observations.
- **Scientific Ethics:** Factor contributions describe statistical associations in historical cohort data and avoid claiming direct causal determinism.
