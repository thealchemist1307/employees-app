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
└── ...
```

---

## Prerequisites
- Node.js (v22.x recommended, managed via nvm)
- npm (comes with Node.js)
- PostgreSQL database

---

## Setup

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

## Production Build & Serve

### 1. Build Backend
```bash
cd apps/api-node
npm run build
```

### 2. Build Frontend
```bash
cd apps/web
npm run build
```
- This outputs static files to `apps/web/dist`.

### 3. Deploy Frontend to Backend
```bash
cp -r apps/web/dist/* apps/api-node/public/
```

### 4. Start Backend in Production
```bash
cd apps/api-node
npm start
```
- The backend will serve the frontend at its root URL and the GraphQL API at `/graphql`.

---

## Running on a Custom Port & CORS
- The backend is configured to run on port **4700**.
- CORS is enabled for:
  - `https://employeesapp.shauqtechnology.in`
  - `http://192.168.1.12`

---

## Systemd Service (Auto-Restart on Reboot)

A systemd service is set up to ensure the backend restarts on reboot or crash.

**Service file:** `/etc/systemd/system/employees-api.service`

```
[Unit]
Description=Employees API Node.js Backend
After=network.target

[Service]
Type=simple
User=nishit
WorkingDirectory=/home/nishit/employees-app/apps/api-node
ExecStart=/home/nishit/.nvm/versions/node/v22.17.0/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=4700

[Install]
WantedBy=multi-user.target
```

**Enable and start the service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable employees-api
sudo systemctl start employees-api
```

**Check status:**
```bash
sudo systemctl status employees-api
```

**View logs:**
```bash
sudo journalctl -u employees-api -f
```

---

## Deployment on Subdomain

The app is deployed on your own subdomain:
- **Frontend & Backend:** [https://employeesapp.shauqtechnology.in/](https://employeesapp.shauqtechnology.in/)

**DNS & Reverse Proxy:**
- The subdomain should point to your server's public IP.
- Use Nginx or Caddy as a reverse proxy to forward HTTPS traffic to your backend's port 4700.
- Example Nginx config:
  ```nginx
  server {
    listen 443 ssl;
    server_name employeesapp.shauqtechnology.in;

    ssl_certificate /etc/letsencrypt/live/employeesapp.shauqtechnology.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/employeesapp.shauqtechnology.in/privkey.pem;

    location / {
      proxy_pass http://localhost:4700;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
  ```

---

## Notes
- Make sure your database is running and accessible from the backend.
- Update environment variables as needed for production security.
- For any changes to the backend, rebuild and restart the systemd service.

---

## License
MIT 