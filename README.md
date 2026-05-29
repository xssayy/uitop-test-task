# uitop-test-task — Todo App

A full-stack task management application built with NestJS and React.

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Material UI, Axios, React Hook Form  
**Backend:** NestJS 11, TypeScript, Prisma ORM, SQLite

---

## Requirements

- Node.js >= 18
- npm >= 9

---

## Quick Start

### 1. Clone the repository

```bash
git clone <repo-url>
cd uitop-test-task
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory if it doesn't exist:

```env
DATABASE_URL="file:./dev.db"
```

Run migrations and seed the database:

```bash
npm run prisma:migrate
npx prisma db seed
```

Start the development server:

```bash
npm run start:dev
```

Backend will be available at: **http://localhost:3000**

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory if it doesn't exist:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## Project Structure

```
uitop-test-task/
├── backend/                # NestJS server
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Seed data (categories)
│   │   └── migrations/     # Database migrations
│   └── src/
│       ├── todos/          # Todos module
│       ├── category/       # Categories module
│       └── prisma/         # Prisma service
└── frontend/               # React application
    └── src/
        ├── api/            # Axios HTTP clients
        ├── components/     # UI components
        └── types/          # TypeScript types
```

## Database

Uses **SQLite** (file: `backend/prisma/dev.db`).

The seed script creates the following default categories:

- Work
- Personal
- Shopping
- Health
- Other

To browse and edit data via GUI:

```bash
cd backend
npm run prisma:studio
```
