# Student Management Frontend

React 19 + TypeScript + Vite enterprise frontend client for the Student Management API.

## Features
- **Monochrome UI**: High-contrast, clean minimalist design system without distracting colors.
- **Academic Dashboard**: Live institutional stats, recent student enrollments, and operational status.
- **Students Directory**: Search, filter, paginate, create, view, edit, and delete student records.
- **FastAPI Proxy**: Transparent `/api` forwarding to `http://127.0.0.1:8000`.

## Scripts

- `npm run dev`: Start the local development server at `http://127.0.0.1:5173`.
- `npm run build`: Type-check with `tsc -b` and produce production assets in `dist/`.
- `npm run lint`: Lint source files using Oxlint.
- `npm run preview`: Preview the production build locally.
- `node scripts/verify-integration.mjs`: Run end-to-end integration tests against running backend.
