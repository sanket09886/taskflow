# TaskFlow — Team Task Manager

## Live URL: [Railway URL here]
## GitHub: [repo link]

TaskFlow is a production-ready team task manager built as a Railway-friendly monorepo with a React frontend, Express API, Prisma ORM, PostgreSQL, JWT auth, role permissions, seed data, and a responsive Kanban workflow.

## Features

- JWT register, login, logout, protected routes, and automatic logout on expired token
- Admin and Member roles with protected admin-only user, project, member, and task actions
- Dashboard with total projects, my tasks, overdue count, done count, task status donut chart, assigned-task table, and red overdue highlighting
- Projects grid with task counts, deadlines, empty states, and admin-only project creation
- Project detail page with project header, member avatars, member management panel, and four-column Kanban board
- Drag-and-drop task status updates using `@dnd-kit/core` with optimistic UI rollback on failure
- Task creation modal and task detail side drawer with edit controls
- Consistent API response shape: `{ success, data, message }`
- Input validation on backend and inline validation errors on frontend forms
- Seed data with 1 admin, 2 members, 2 projects, and 8 tasks
- Responsive layout with dark sidebar, white main area, indigo primary actions, status badges, priority badges, loading spinners, and 404 page

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, TailwindCSS, shadcn/ui-style components, Recharts, dnd-kit |
| Backend | Node.js, Express.js, Helmet, CORS, express-validator |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT access token, bcrypt password hashing |
| Deployment | Railway monorepo with Nixpacks |

## Getting Started (Local Setup)

### 1. Install tools

Install these first:

- Node.js 20 or newer
- PostgreSQL 15 or newer
- Git

Check versions:

```bash
node -v
npm -v
psql --version
```

### 2. Open the project

```bash
cd taskflow
```

### 3. Install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 4. Create the backend environment file

```bash
cd ../backend
cp .env.example .env
```

Edit `backend/.env` and set your PostgreSQL URL:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskflow?schema=public"
JWT_SECRET="supersecretkey"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

### 5. Create the frontend environment file

```bash
cd ../frontend
cp .env.example .env
```

Keep this for local development:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Create the PostgreSQL database

```bash
createdb taskflow
```

If `createdb` is unavailable, open pgAdmin and create a database named `taskflow`.

### 7. Run Prisma migration

```bash
cd ../backend
npx prisma migrate dev --name init
```

### 8. Seed sample data

```bash
npm run seed
```

Seed login accounts:

```text
admin@taskflow.com / Admin@123
alice@taskflow.com / Alice@123
bob@taskflow.com / Bob@123
```

### 9. Start the backend

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000/api
```

### 10. Start the frontend

Open a second terminal:

```bash
cd taskflow/frontend
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## API Documentation

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Register with name, email, password |
| POST | `/api/auth/login` | No | Login and receive `{ token, user }` |
| GET | `/api/auth/me` | Yes | Return current user |
| GET | `/api/users` | Admin | List all users |
| GET | `/api/projects` | Yes | List projects where user is a member |
| POST | `/api/projects` | Admin | Create project |
| GET | `/api/projects/:id` | Yes | Project detail with members and tasks |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/projects/:id/members` | Admin | Add project member |
| DELETE | `/api/projects/:id/members/:userId` | Admin | Remove project member |
| GET | `/api/projects/:id/tasks` | Yes | List tasks in project |
| POST | `/api/projects/:id/tasks` | Admin | Create task |
| PUT | `/api/tasks/:id` | Admin or assignee | Update task |
| DELETE | `/api/tasks/:id` | Admin | Delete task |
| PATCH | `/api/tasks/:id/status` | Admin or assignee | Update task status |
| GET | `/api/dashboard` | Yes | Dashboard totals, status counts, overdue tasks, my tasks, recent activity |
| GET | `/api/health` | No | Health check |

## Screenshots

Add screenshots after running the app locally or after deployment:

- Dashboard: `docs/screenshots/dashboard.png`
- Kanban: `docs/screenshots/kanban.png`
- Login: `docs/screenshots/login.png`
- Projects: `docs/screenshots/projects.png`

## Demo Video

[Add Loom/YouTube demo link here]

## Role Permissions

| Action | Admin | Member |
| --- | --- | --- |
| Register and login | Yes | Yes |
| View own projects | Yes | Yes |
| View dashboard | Yes | Yes |
| View project tasks | Yes | Yes |
| Create projects | Yes | No |
| Update/delete projects | Yes | No |
| Add/remove members | Yes | No |
| List all users | Yes | No |
| Create tasks | Yes | No |
| Update any task | Yes | No |
| Update assigned task status | Yes | Yes |
| Delete tasks | Yes | No |

## Railway Deployment

### Backend service

1. Push this repo to GitHub.
2. Create a Railway project.
3. Add a PostgreSQL database in Railway.
4. Create a backend service from the GitHub repo.
5. Set root directory or commands so Railway uses the backend:

```bash
cd backend && npm run build
cd backend && npm start
```

6. Add backend environment variables:

```env
DATABASE_URL=<Railway PostgreSQL URL>
JWT_SECRET=<long random secret>
PORT=5000
FRONTEND_URL=<frontend Railway URL>
```

7. Run seed once from Railway shell if you want demo data:

```bash
cd backend && npm run seed
```

### Frontend service

Create a second Railway service for the frontend:

```bash
cd frontend && npm install
cd frontend && npm run build
```

Set output directory:

```text
frontend/dist
```

Set frontend environment variable:

```env
VITE_API_URL=<backend Railway URL>/api
```

For preview hosting:

```bash
cd frontend && npm run preview
```

## Beginner Execution Checklist

1. Install Node.js and PostgreSQL.
2. Open a terminal in `taskflow`.
3. Run `cd backend && npm install`.
4. Run `cd ../frontend && npm install`.
5. Copy both `.env.example` files to `.env`.
6. Create the `taskflow` PostgreSQL database.
7. Run `cd backend && npx prisma migrate dev --name init`.
8. Run `npm run seed`.
9. Run `npm run dev` in `backend`.
10. Run `npm run dev` in `frontend`.
11. Open `http://localhost:5173`.
12. Login with `admin@taskflow.com / Admin@123`.

## Quality Checklist Status

- Prisma schema and migration included
- Seed file creates 1 Admin user, 2 Members, 2 Projects, 8 Tasks
- API routes return consistent JSON
- Frontend loading spinners included on async pages
- Empty states included on list pages
- 404 page included
- Inline validation errors included
- Optimistic UI task status update included
- JWT expiry handled by axios interceptor
- Dates formatted as `12 Jan 2025` using `date-fns`

