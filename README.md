# Employees App

A full-stack employee management application with a Node.js/Express/GraphQL backend (api-node) and a Vite/React frontend (web). The backend uses Prisma ORM with PostgreSQL, and the frontend is built with modern React and Tailwind CSS.

---

## Features
- Employee CRUD (Create, Read, Update, Delete)
- User authentication (JWT-based)
- Role-based access (Admin/Employee)
- Search, sort, and pagination for employees
- Responsive, modern UI
- Production-ready build and deployment

---

## Project Structure

```
employees-app/
├── apps/
│   ├── api-node/      # Backend (Node.js, Express, GraphQL, Prisma)
│   └── web/           # Frontend (React, Vite, Tailwind)
├── package.json       # Monorepo root
├── tsconfig.base.json # Shared TypeScript config
├── docker-compose.yml # Docker Compose for deployment
└── ...
```

---

## Prerequisites
- Node.js (v22.x recommended, managed via nvm) **(for local dev only)**
- npm (comes with Node.js)
- Docker & Docker Compose (for production/deployment)
- PostgreSQL database

---

## Setup (Local Development)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd employees-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in `apps/api-node/` and set your database credentials:
     ```env
     DATABASE_URL=postgresql://emp_user:StrongPassw0rd!@192.168.1.12:5432/employees
     JWT_SECRET=your-secret-key
     ```

4. **Set up the database:**
   ```bash
   cd apps/api-node
   npx prisma migrate deploy
   npx prisma generate
   # (Optional) Seed data:
   npx ts-node prisma/seed.ts
   npx ts-node prisma/seed-users.ts
   ```

---

## Development

### Backend
```bash
cd apps/api-node
npm run dev
```
- Runs the backend on the default port (4000) with hot reload.

### Frontend
```bash
cd apps/web
npm run dev
```
- Runs the frontend on Vite's default port (5173).

---

## Production & Deployment (Docker + Docker Compose)

### 1. Build and Run with Docker Compose

- Make sure your `infra` Docker network exists (or create it with `docker network create infra`).
- Make sure your PostgreSQL database is running and accessible to the container (see `DATABASE_URL` in `docker-compose.yml`).

```bash
docker compose up --build -d
```
- This will build the backend Docker image, copy the frontend build into the backend, and start the backend container on port 4000.
- The backend will serve the frontend at its root URL and the GraphQL API at `/graphql`.

### 2. Stopping and Removing Containers
```bash
docker compose down --remove-orphans
```

---

## CI/CD Automation (GitHub Actions)

This project uses GitHub Actions for automated build and deployment on push to the `main` branch.

- The workflow is defined in `.github/workflows/deploy.yml`.
- Steps include:
  - Install dependencies
  - Build the frontend
  - Copy the frontend build into the backend
  - Tear down any previous Docker stack
  - Build and deploy the backend Docker image
  - Start the backend container with Docker Compose

**No manual steps are needed for deployment if you push to `main`!**

---

## Running on a Custom Port & CORS
- The backend is configured to run on port **4000** (as set in `docker-compose.yml`).
- CORS is enabled for:
  - `https://employeesapp.shauqtechnology.in`

---

## Deployment on Subdomain (with Cloudflare)

The app is deployed on your own subdomain:
- **Frontend & Backend:** [https://employeesapp.shauqtechnology.in/](https://employeesapp.shauqtechnology.in/)

**DNS & Proxy:**
- The subdomain is managed via Cloudflare, which provides DNS, HTTPS, and reverse proxying to your backend's port 4000.
- Cloudflare handles SSL termination and forwards requests to your server securely.
- No Nginx or Caddy configuration is required; simply point your subdomain's DNS A record to your server's public IP and enable the Cloudflare proxy (orange cloud).

---

## Notes
- Make sure your database is running and accessible from the backend container.
- Update environment variables as needed for production security.
- For any changes to the backend or frontend, just push to `main` and GitHub Actions will redeploy automatically.

---

## License
MIT 
