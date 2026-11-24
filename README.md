# Student Management Frontend

A modern single-page application built with **React 19 + Vite** for managing classes and students. Consumes the [Student Management API](../student-management-api).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Routing | React Router v7 |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form |
| HTTP Client | Axios |
| Notifications | Sonner (toasts) |
| Icons | Lucide React |

---

## Requirements

- Node.js 18+
- npm
- [Student Management API](../student-management-api) running on `http://localhost:8000`

---

## Project Setup

### 1. Install dependencies

```bash
cd student-management-frontend
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Or create `.env.local` manually:

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Start the development server

```bash
npm run dev
```

App is now available at **http://localhost:3000**

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Type-check then build for production |
| `npm run type-check` | Run TypeScript compiler check only |
| `npm run preview` | Preview the production build locally |

---

## Features

- **Dashboard** — Overview with student and class counts + recent lists
- **Classes** — Full CRUD: list, create, view detail, edit, delete
- **Students** — Full CRUD with search by name / email / class
- **Assign existing student** to a class directly from the class detail page
- **Toast alerts** — Success and error messages on every action
- **Error handling** — Laravel validation errors displayed inline or as toasts

---

## Project Structure

```
student-management-frontend/
├── api/                        # API layer (one file per resource)
│   ├── classApi.ts             # getClassesApi, createClassApi, ...
│   └── studentApi.ts           # getStudentsApi, createStudentApi, ...
├── components/
│   ├── common/                 # Reusable UI building blocks
│   │   ├── PageHeader.tsx      # Page title + description + action buttons
│   │   ├── InputField.tsx      # Label + Input + error message
│   │   ├── SelectField.tsx     # Label + Select + error message
│   │   ├── TableEmptyState.tsx # Empty table placeholder with icon + action
│   │   └── DetailRow.tsx       # Key/value row for detail views
│   ├── AppLayout.tsx           # Sidebar + header breadcrumbs layout
│   ├── Providers.tsx           # TanStack Query provider + Sonner Toaster
│   ├── Sidebar.tsx             # Navigation sidebar
│   └── ui.tsx                  # Base UI primitives (Button, Input, Card, Badge...)
├── helpers/
│   └── errors.ts               # handleApiError() — parses API errors → toast
├── interface/                  # TypeScript interfaces
│   ├── common.ts               # ApiSuccessResponse, ApiPaginatedResponse, ApiErrorBody
│   ├── class.ts                # ClassItem, CreateClassPayload, UpdateClassPayload
│   └── student.ts              # Student, CreateStudentPayload, UpdateStudentPayload
├── lib/
│   ├── api.ts                  # Axios instance with base URL + interceptors
│   └── utils.ts                # cn() (class merge), formatDate()
└── src/
    ├── index.css               # Tailwind 4 theme + CSS variables
    ├── main.tsx                # App entry point
    ├── router.tsx              # BrowserRouter with all routes
    ├── vite-env.d.ts           # Vite env type declarations
    └── pages/
        ├── DashboardPage.tsx
        ├── classes/
        │   ├── ClassListPage.tsx
        │   ├── ClassCreatePage.tsx
        │   ├── ClassDetailPage.tsx
        │   └── ClassEditPage.tsx
        └── students/
            ├── StudentListPage.tsx
            ├── StudentCreatePage.tsx
            ├── StudentDetailPage.tsx
            └── StudentEditPage.tsx
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Dashboard |
| `/classes` | Class list |
| `/classes/create` | Create class |
| `/classes/:id` | Class detail + students |
| `/classes/:id/edit` | Edit class |
| `/students` | Student list (with search) |
| `/students/create` | Create student |
| `/students/:id` | Student detail |
| `/students/:id/edit` | Edit student |

---

## Running Both Projects Together

```bash
# Terminal 1 — API (port 8000)
cd student-management-api
php artisan serve

# Terminal 2 — Frontend (port 3000)
cd student-management-frontend
npm run dev
```

Then open **http://localhost:3000** in your browser.
