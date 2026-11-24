# SE Indonesia Stock

A simple stock opname application. Staff count the stock in their store and submit the result. A manager then reviews the submission and approves or rejects it. When a submission is approved, the store stock is updated to match the staff count.

## Features

- Login with role-based access (staff and manager)
- Staff submit stock counts for their store
- Manager approves or rejects each submission
- Approved counts update the stock of the store and the total product stock

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | Next.js 16, Ant Design 6            |
| Backend    | Express 5 (Node.js)                 |
| Database   | PostgreSQL                          |
| Migrations | node-pg-migrate                     |
| Proxy      | Nginx                               |
| Runtime    | Node.js 24, Docker, Docker Compose  |

## Project Structure

```
.
├── apps
│   ├── backend      # Express API
│   ├── frontend     # Next.js web app
│   └── migrations   # Database migrations and seeds
└── infrastructure   # Docker Compose and Dockerfiles
```

## Requirements

- Docker and Docker Compose
- Node.js 24 (only needed if you want to run something outside Docker)

## How to Run

### 1. Set up the infrastructure environment

Go to the `infrastructure` folder and copy the example file.

```bash
# Linux / macOS
cp .env.example .env

# Windows (CMD)
copy .env.example .env
```

Fill in `infrastructure/.env`:

```env
POSTGRES_DB=seindonesia_stock
POSTGRES_USER=seindonesia
POSTGRES_PASSWORD=P@ssw0rd
BACKEND_PATH=./../apps/backend
FRONTEND_PATH=./../apps/frontend
MIGRATIONS_PATH=./../apps/migrations
```

### 2. Set up the backend environment

Go to `apps/backend` and copy the example file.

```bash
# Linux / macOS
cp .env.example .env

# Windows (CMD)
copy .env.example .env
```

Fill in `apps/backend/.env`:

```env
# app
NODE_ENV=local
APP_NAME="Backend Service"
PORT=3000
THROTTLE_LIMIT=60
LOG_LEVEL=info

# database
DB_HOST=postgres
DB_PORT=5432
DB_USER=seindonesia
DB_PASSWORD=P@ssw0rd
DB_DATABASE=seindonesia_stock
DB_TIMEZONE=UTC

# jwt
JWT_SECRET_KEY=sVQwlAD4cRuFK0doWyCzY0ZDQ5hvmYEOsDCSyvgPAdR51j50RPQmUVSLHjB7w8Y8
```

### 3. Set up the frontend environment

Go to `apps/frontend` and copy the example file.

```bash
# Linux / macOS
cp .env.example .env

# Windows (CMD)
copy .env.example .env
```

Fill in `apps/frontend/.env`:

```env
NEXT_PUBLIC_API_URL=/services
```

When you run with Docker and Nginx, the backend is available under the `/services` path, so a relative path is enough.

### 4. Start the containers

From the `infrastructure` folder:

```bash
docker-compose up
```

Add `-d` if you want to run it in the background.

### 5. Run the migrations and seed

Open a shell inside the `migrations` container:

```bash
docker-compose exec migrations sh
```

Then run:

```bash
npm run migrate:up
npm run seed
```

### 6. Open the app

- Web app: http://localhost
- Backend API: http://localhost/services

## Default Accounts

These accounts are created by `npm run seed`. The password for both is `P@ssw0rd`.

| Role    | Email                          |
| ------- | ------------------------------ |
| Staff   | staff.store1@seindonesia.com   |
| Manager | staff.manager@seindonesia.com  |

## Notes

- The database password and `JWT_SECRET_KEY` above are for local development only. Always change them before you deploy to a real environment.
- There is no API documentation (Swagger) for now.