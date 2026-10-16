# Student Management System

A production-grade, full-stack application for managing academic student records, built with a **FastAPI + SQLite** backend and a **React + TypeScript + Vite** frontend designed with a strict, minimalist monochrome SaaS aesthetic.

---

## Table of Contents

- [Overview](#overview)
- [Key Features & Screens](#key-features--screens)
- [Monochrome Design System](#monochrome-design-system)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local Development Workflow](#local-development-workflow)
  - [1. Backend Setup & Run](#1-backend-setup--run)
  - [2. Frontend Setup & Run](#2-frontend-setup--run)
  - [3. Full-Stack Dev Server Proxy](#3-full-stack-dev-server-proxy)
- [API Documentation & Endpoints](#api-documentation--endpoints)
  - [Interactive Docs](#interactive-docs)
  - [Endpoints Reference](#endpoints-reference)
  - [Example Student Record](#example-student-record)
  - [curl Command Examples](#curl-command-examples)
- [Validation & Error Handling](#validation--error-handling)
- [Testing & Quality Assurance](#testing--quality-assurance)
  - [Backend Pytest Suite](#backend-pytest-suite)
  - [Frontend Typecheck & Production Build](#frontend-typecheck--production-build)
  - [Integration Verification Suite](#integration-verification-suite)
- [Environment Configuration](#environment-configuration)
- [Deployment Requirements & Limitations](#deployment-requirements--limitations)

---

## Overview

The **Student Management System** provides academic institutions and administrators with an end-to-end interface for student registrations, records maintenance, course cohort management, and contact validation. The system combines:

1. **A Reliable Python Backend**: FastAPI REST API with SQLAlchemy ORM, Pydantic v2 data validation, and persistent SQLite storage.
2. **A Polished Enterprise Frontend**: React 19 + TypeScript + Vite application styled according to a strict monochrome visual hierarchy with zero distracting color accents, clear loading/error states, and keyboard accessibility.

---

## Key Features & Screens

### 1. Application Shell
- **Responsive Layout**: Permanent sidebar navigation on desktop viewports, responsive slide-out drawer on mobile/tablet viewports.
- **Real-Time Health Status**: Header pill indicator continuously monitoring FastAPI engine and SQLite database reachability (`/health`).
- **Quick Actions**: Global "New Student" modal trigger accessible across all screens.

### 2. Academic Dashboard
- **Institutional Metrics**:
  - **Total Students**: Real-time count of enrolled students fetched from the backend.
  - **Active Courses**: Dynamically derived count of unique academic departments/majors.
  - **Email Coverage**: Real count and percentage of student body with verified email contact.
  - **Phone Coverage**: Real count and percentage of student body reachable via phone.
- **Recent Registrations**: Summary list of the latest enrolled students with quick actions to inspect profiles.
- **System Integrity Card**: Operational parameters, database layer status, and transaction safety overview.

### 3. Students Directory
- **Data Table**: Paginated records table showing Student ID, Full Name, Email, Phone, Course, Date of Birth, and contextual row actions.
- **Search & Filtering**:
  - Instant substring search by full name (`?name=`).
  - Course-level filtering dropdown (`?course=`).
  - Filter reset shortcuts.
- **Pagination**: Server-aligned offset pagination (`skip` and `limit`).
- **Responsive Actions**: View Profile (drawer modal), Edit Record, and Delete Record.

### 4. Student Creation & Inline Validation
- Unique `student_id` validation (letters, numbers, dashes, underscores).
- Client-side pre-validation + backend duplicate conflict handling (`409 Conflict`).
- **At-Least-One-Contact Rule**: Enforces that either email or phone is provided.
- Realistic date constraints (birth date between 1900 and today; enrollment date >= birth date).
- Prevention of duplicate submissions while async requests are in flight.

### 5. Profile Details & Record Editing
- Modal displaying complete student metadata (identifiers, contact details, residence, academic course, enrollment date).
- Edit form utilizing `PATCH` updates that safeguard against unintentional removal of contact records.

### 6. Destructive Actions with Confirmation
- Deletion confirmation dialog prevents accidental data loss before executing `DELETE /students/{student_id}`.
- Auto-updating toast notification system for created, edited, and deleted records.

---

## Monochrome Design System

The application strictly implements a high-contrast, distraction-free monochrome aesthetic inspired by enterprise design systems:

| Element | Specification |
|---|---|
| **Text** | Black or near-black (`#09090b`, `#27272a`, `#52525b`) for all headings, labels, badges, buttons, and content |
| **Canvas** | White / light grey (`#ffffff`, `#fafafa`, `#f4f4f5`) |
| **Cards & Surfaces** | White backgrounds with subtle borders (`#e4e4e7`, `#d4d4d8`) and enterprise elevation |
| **Buttons** | White or light-grey backgrounds, solid dark borders (`#18181b`), black text |
| **Badges & Chips** | Light grey backgrounds with crisp borders and black typography |
| **Typography** | Inter with tabular numbers for identifiers and dates |
| **Accents** | Strictly monochrome — no blue, green, orange, or colourful gradients |

---

## Technology Stack

### Backend
- **Language**: Python 3.10+
- **Framework**: FastAPI 0.143+
- **ORM & Database**: SQLAlchemy 2.x + SQLite (persisted to `students.db`)
- **Data Validation**: Pydantic 2.x + `email-validator`
- **Testing**: pytest 9.x + FastAPI `TestClient`
- **ASGI Server**: Uvicorn

### Frontend
- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8.x
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design Tokens (CSS Custom Properties)
- **Linter**: Oxlint

---

## Repository Structure

```
Student-Management-API/
├── app/
│   ├── __init__.py
│   ├── database.py       # SQLite engine, session factory, get_db dependency
│   ├── main.py           # FastAPI application, routes, error handling, CORS
│   ├── models.py         # SQLAlchemy Student ORM model
│   └── schemas.py        # Pydantic request/response schemas & validation
├── tests/
│   └── test_students.py  # 20 automated backend unit/integration tests
├── frontend/
│   ├── public/
│   ├── scripts/
│   │   └── verify-integration.mjs # 20-point automated full-stack integration test
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/   # Modal, ConfirmDialog, Toast, Badge, EmptyState
│   │   │   ├── dashboard/# StatCard, RecentStudents
│   │   │   ├── layout/   # Sidebar, Topbar
│   │   │   └── students/ # StudentTable, StudentFormModal, StudentDetailModal
│   │   ├── hooks/        # useBackendHealth
│   │   ├── pages/        # DashboardPage, StudentsPage
│   │   ├── services/     # api.ts (Typed client & HTTP error formatting)
│   │   ├── styles/       # variables.css (monochrome tokens), index.css
│   │   ├── types/        # student.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts    # Configured with proxy for /api -> http://127.0.0.1:8000
├── pytest.ini
├── requirements.txt
└── README.md
```

---

## Prerequisites

- **Python**: 3.10 or newer (`python3 --version`)
- **Node.js**: v18 or newer (`node -v`)
- **npm**: v9 or newer (`npm -v`)

---

## Local Development Workflow

### 1. Backend Setup & Run

Open a terminal in the repository root:

```bash
# 1. Create and activate a Python virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Start the FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API will listen on `http://127.0.0.1:8000`. Database tables are initialized automatically on startup inside `students.db`.

### 2. Frontend Setup & Run

In a separate terminal window:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Launch the Vite dev server
npm run dev -- --host 127.0.0.1 --port 5173
```

The frontend will be accessible at `http://127.0.0.1:5173`.

### 3. Full-Stack Dev Server Proxy

The frontend Vite server is configured with an automatic reverse proxy:
- Requests made to `http://127.0.0.1:5173/api/*` are transparently forwarded to `http://127.0.0.1:8000/*`.
- Example: `/api/students` -> `http://127.0.0.1:8000/students`
- Example: `/api/health` -> `http://127.0.0.1:8000/health`

This avoids CORS issues during local development and allows seamless API interaction.

---

## API Documentation & Endpoints

### Interactive Docs
- **Swagger UI:** <http://127.0.0.1:8000/docs>
- **OpenAPI JSON:** <http://127.0.0.1:8000/openapi.json>

### Endpoints Reference

| Method | Path | Description | Success | Error Codes |
|---|---|---|---|---|
| `GET` | `/health` | Application & SQLite database connectivity check | `200` | `503` |
| `POST` | `/students` | Register a new student record (unique `student_id`) | `201` | `409`, `422` |
| `GET` | `/students` | List students with filters (`?name=`, `?course=`, `?skip=`, `?limit=`) | `200` | — |
| `GET` | `/students/{student_id}` | Retrieve a single student by identifier | `200` | `404` |
| `PUT` | `/students/{student_id}` | Complete replacement of student record | `200` | `404`, `422` |
| `PATCH`| `/students/{student_id}` | Partial update of supplied fields | `200` | `404`, `422` |
| `DELETE`| `/students/{student_id}` | Delete a student record | `204` | `404` |

### Example Student Record

```json
{
  "student_id": "STU1001",
  "full_name": "Asha Verma",
  "date_of_birth": "2004-05-12",
  "email": "asha.verma@example.com",
  "phone": "+91 98765 43210",
  "course": "Computer Science",
  "address": "12 Lake Road, Pune",
  "enrollment_date": "2024-08-01"
}
```

### curl Command Examples

```bash
# Check health
curl http://127.0.0.1:8000/health

# Create a student
curl -X POST http://127.0.0.1:8000/students \
  -H "Content-Type: application/json" \
  -d '{"student_id":"STU1001","full_name":"Asha Verma","date_of_birth":"2004-05-12","email":"asha.verma@example.com","course":"Computer Science","enrollment_date":"2024-08-01"}'

# List students with filtering
curl "http://127.0.0.1:8000/students?name=asha&course=computer"

# Fetch one student
curl http://127.0.0.1:8000/students/STU1001

# Partial update (PATCH)
curl -X PATCH http://127.0.0.1:8000/students/STU1001 \
  -H "Content-Type: application/json" \
  -d '{"course":"Artificial Intelligence"}'

# Delete student
curl -X DELETE http://127.0.0.1:8000/students/STU1001
```

---

## Validation & Error Handling

- **`student_id`**: 1–32 characters, letters, digits, dashes, and underscores only (`^[A-Za-z0-9_-]+$`). Must be unique; returns `409 Conflict` on duplicates.
- **`full_name`**: 2–100 characters.
- **`date_of_birth`**: Valid date in `YYYY-MM-DD` format between 1900-01-01 and the current date (cannot be in the future).
- **`email`**: Valid RFC email syntax verified through `email-validator`.
- **`phone`**: 7–15 digits; permitted formatting characters: `+ ( ) - .` and spaces.
- **Contact Requirement**: Every student record must have **at least one** contact channel (email or phone). Payloads with neither will be rejected with `422 Unprocessable Entity`.
- **`enrollment_date`**: Optional date; cannot precede `date_of_birth`.
- **Resource Not Found**: Requests for non-existent IDs return `404 Not Found` with `{"detail": "student '<id>' not found"}`.

---

## Testing & Quality Assurance

### Backend Pytest Suite

Run the 20-test automated suite against an isolated throwaway SQLite test database:

```bash
# In repository root
pytest -q
```

**Result:** `20 passed`

### Frontend Typecheck & Production Build

Ensure all TypeScript types and bundler outputs compile cleanly:

```bash
cd frontend
npm run build
```

**Result:** `✓ built in ~700ms` with 0 type errors.

### Integration Verification Suite

Verify end-to-end communication, status codes (200, 201, 204, 404, 409, 422), filtering, and database persistence:

```bash
# With backend and frontend servers running
node frontend/scripts/verify-integration.mjs
```

**Result:** `20/20 checks passed successfully.`

---

## Environment Configuration

| Variable | Scope | Default Value | Description |
|---|---|---|---|
| `STUDENT_DATABASE_URL` | Backend | `sqlite:///<root>/students.db` | SQLAlchemy connection string. Allows pointing to alternate SQLite or database path. |
| `VITE_API_BASE_URL` | Frontend | `/api` | Base path for frontend API requests. Uses Vite proxy in development. |

---

## Deployment Requirements & Limitations

- **State Persistence**: The backend uses SQLite. For multi-container or serverless deployments, ensure the SQLite database file resides on a persistent volume, or migrate the connection string to a client-server relational database.
- **Single-Tenant Demo Scope**: As specified in the project assignment, authentication/RBAC is omitted to allow reviewers immediate, unrestricted access to the evaluation interface.
- **CORS Setup**: FastAPI is configured with minimal CORS support for local development origins (`http://localhost:5173`, `http://127.0.0.1:5173`). Update `ALLOWED_ORIGINS` in `app/main.py` if deploying the frontend to a distinct production domain.
