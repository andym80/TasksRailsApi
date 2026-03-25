# TasksRailsApi
Sistema de gestión de tareas (Task Manager) con las siguientes características:


# Task Manager

A full-stack task management application built with **Ruby on Rails 8** as a REST API backend and **Next.js 16** as the frontend, backed by **PostgreSQL** and fully containerized with **Docker Compose**.

---

## What does it do?

Task Manager lets you organize work into **Projects** and **Tasks**.

- Create and manage multiple projects
- Add tasks to each project with title, description, priority and due date
- Update task status in real time (Pending → In Progress → Completed)
- Filter tasks by status and priority across all projects
- View a global task list sorted by due date

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Ruby on Rails 8.1.3 — API only mode |
| Frontend | Next.js 16 — App Router + TypeScript |
| UI | Material UI (MUI v5) |
| Database | PostgreSQL 16 |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Notifications | React Hot Toast |
| Pagination | Kaminari |
| Dev Environment | Docker + Docker Compose |

---

## Requirements

- **Docker Desktop** 4.x or higher
- **Docker Compose** v2.x
- **Git**

No need to install Ruby, Node.js or PostgreSQL locally. Everything runs inside Docker containers.

---

## How to run it

### 1. Clone the repo

```bash
git clone https://github.com/andymenutti/task-manager.git
cd task-manager
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

The `.env.example` file contains:

```env
DATABASE_URL=postgresql://postgres:password@db:5432/taskmanager_development
RAILS_ENV=development
SECRET_KEY_BASE=supersecretkey123
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Build Docker images

```bash
docker compose build
```

This will build both the Rails backend and Next.js frontend images. Takes 3–5 minutes on first run.

### 4. Start all services

```bash
docker compose up
```

This starts three containers: PostgreSQL, Rails API, and Next.js frontend.

### 5. Set up the database (first time only)

Open a **new terminal** and run:

```bash
docker compose exec backend rails db:create
docker compose exec backend rails db:migrate
docker compose exec backend rails db:seed
```

The seed will create sample users, projects and tasks so you can explore the app immediately.

### 6. Open the app

| Service | URL |
|---------|-----|
| Frontend (Next.js) | http://localhost:3000 |
| Backend API (Rails) | http://localhost:3001 |

---

## Project Structure

```
task-manager/
├── backend/                        # Rails API
│   ├── app/
│   │   ├── controllers/
│   │   │   └── api/v1/
│   │   │       ├── projects_controller.rb
│   │   │       └── tasks_controller.rb
│   │   └── models/
│   │       ├── user.rb
│   │       ├── project.rb
│   │       └── task.rb
│   ├── config/
│   │   ├── routes.rb
│   │   └── initializers/cors.rb
│   ├── db/
│   │   ├── migrate/
│   │   └── seeds.rb
│   ├── test/
│   │   ├── models/           # 9 unit tests
│   │   └── controllers/      # 3 integration tests
│   └── Dockerfile
├── frontend/                       # Next.js App
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx            # Projects list
│   │   │   └── [id]/page.tsx       # Project detail + tasks
│   │   └── tasks/
│   │       └── page.tsx            # Global tasks view
│   ├── lib/
│   │   └── api.ts                  # Axios API client + TypeScript types
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Data Models

### User
| Field | Type | Notes |
|-------|------|-------|
| name | string | required |
| email | string | required, unique |

### Project
| Field | Type | Notes |
|-------|------|-------|
| name | string | required |
| description | text | optional |
| user_id | integer | foreign key → User |

### Task
| Field | Type | Notes |
|-------|------|-------|
| title | string | required |
| description | text | optional |
| status | enum | `pending` / `in_progress` / `completed` |
| priority | enum | `low` / `medium` / `high` |
| due_date | date | optional |
| project_id | integer | foreign key → Project |
| assigned_to_id | integer | optional foreign key → User |

---

## API Endpoints

### Projects

```
GET     /api/v1/projects           → list all projects (with tasks)
POST    /api/v1/projects           → create project
GET     /api/v1/projects/:id       → project detail with tasks
PUT     /api/v1/projects/:id       → update project
DELETE  /api/v1/projects/:id       → delete project
```

### Tasks

```
POST    /api/v1/projects/:id/tasks          → create task in project
GET     /api/v1/tasks                       → list all tasks
GET     /api/v1/tasks?status=X&priority=Y   → filter tasks
PUT     /api/v1/tasks/:id                   → update task
PATCH   /api/v1/tasks/:id/status            → update status only
DELETE  /api/v1/tasks/:id                   → delete task
```

### Quick test with curl

```bash
# Get all projects
curl http://localhost:3001/api/v1/projects

# Create a project
curl -X POST http://localhost:3001/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "My Project", "user_id": 1}}'

# Filter pending high-priority tasks
curl "http://localhost:3001/api/v1/tasks?status=pending&priority=high"

# Mark task as completed
curl -X PATCH http://localhost:3001/api/v1/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

---

## Running Tests

```bash
# All tests
docker compose exec backend rails test

# Model tests only
docker compose exec backend rails test test/models/

# Controller tests only
docker compose exec backend rails test test/controllers/
```

Current test suite: **12 tests, 25 assertions, 0 failures**.

---

## Useful Commands

```bash
# View logs
docker compose logs -f

# Rails console
docker compose exec backend rails console

# Stop all services
docker compose down

# Full reset (wipes database)
docker compose down -v
docker compose up
docker compose exec backend rails db:create db:migrate db:seed
```

---

## Author

**Andy Menutti** — Creative Technologist & Full Stack Developer

[andresmenutti.vercel.app](https://andresmenutti.vercel.app) · Selected for a16z Buildspace — top 300 of 32,000 applicants






