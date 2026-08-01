# TaskFlow

A modern task management application built with NestJS, featuring user authentication, role-based access control, and a PostgreSQL database.

## Features

- **User Authentication**: Secure JWT-based authentication with password hashing using bcrypt
- **Role-Based Access Control (RBAC)**: Support for USER and ADMIN roles with role guards
- **Task Management**: Create, read, update, and delete tasks with status tracking
  - Task statuses: OPEN, IN_PROGRESS, DONE
  - Task labels for organization
- **User-Task Relationships**: Users can manage their own tasks
- **Database**: PostgreSQL with TypeORM for robust data persistence
- **Configuration Management**: Environment-based configuration with Joi validation
- **Docker Support**: Docker Compose for easy PostgreSQL setup
- **Testing**: Unit and e2e tests with Jest
- **Code Quality**: ESLint and Prettier for consistent code style

## Tech Stack


- **Framework**: NestJS (Node.js framework)
- **Language**: TypeScript
- **Database**: PostgreSQL 17 / AWS RDS PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Password Hashing**: bcrypt
- **Validation**: class-validator, class-transformer, Joi
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint, Prettier
- **Containerization**: Docker, Docker Compose

## Prerequisites

- Node.js 24
- npm or yarn
- Docker and Docker Compose (for PostgreSQL)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vasylpryimakdev/nest-js-task-flow
cd nest-js-task-flow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
APP_MESSAGE_PREFIX=SOME_MESSAGE
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=tasks
DB_SYNC=false
DB_SSL=false

JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=60m
```

### 4. Start PostgreSQL with Docker Compose

```bash
docker compose -f docker-compose.dev.yml up -d postgres
```

This will start a PostgreSQL container on port 5432 for local/development usage.

### 5. Run database migrations

```bash
npm run migration:run
```

### 6. Start the application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Tasks

- `GET /tasks` - Get all tasks (requires authentication)
- `GET /tasks/:id` - Get a specific task by ID
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Users

- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get a specific user by ID
- `PATCH /users/:id` - Update user information

## Project Structure

```bash
src/
├── config/           # Configuration files (database, auth, app)
├── users/            # User module with authentication
│   ├── auth/         # Authentication service and controller
│   ├── password/     # Password service
│   ├── user/         # User service
│   ├── decorators/   # Custom decorators
│   ├── user.entity.ts
│   └── role.enum.ts
├── tasks/            # Task module
│   ├── task.entity.ts
│   ├── task-label.entity.ts
│   ├── task.model.ts
│   ├── tasks.controller.ts
│   └── tasks.service.ts
├── logger/           # Logging service
├── dummy/            # Dummy service
├── message-formatter/ # Message formatting service
├── app.module.ts
├── app.controller.ts
└── main.ts
```

## Available Scripts

```bash
# Development
npm run start              # Start the application
npm run start:dev          # Start in watch mode
npm run start:debug        # Start in debug mode
npm run start:prod         # Start production build

# Building
npm run build              # Build the application

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Run tests with coverage
npm run test:watch         # Run tests in watch mode

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier

# Database
npm run migration:generate # Generate a new migration
npm run migration:run       # Run pending migrations
npm run migration:run:prod # Run migrations in production
```

## Database Schema

### Users

- `id` (UUID, primary key)
- `name` (string)
- `email` (string, unique)
- `password` (string, hashed)
- `roles` (array of Role enum)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Tasks

- `id` (UUID, primary key)
- `title` (string)
- `description` (text)
- `status` (enum: OPEN, IN_PROGRESS, DONE)
- `userId` (UUID, foreign key)
- `user` (relation to User)
- `labels` (relation to TaskLabel)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### TaskLabels

- `id` (UUID, primary key)
- `name` (string)
- `taskId` (UUID, foreign key)
- `task` (relation to Task)

## Role-Based Access Control

The application implements role-based access control with two roles:

- **USER**: Can manage their own tasks
- **ADMIN**: Can manage all users and tasks

Use the `@Roles()` decorator on controller methods to restrict access:

```typescript
@Roles(Role.ADMIN)
@Get('admin-only')
adminOnlyEndpoint() {
  // Only accessible by admins
}
```

## Docker Compose

The project includes environment-specific Docker Compose files:

- `docker-compose.dev.yml` runs PostgreSQL, migrations, and the API on the same host.
- `docker-compose.prod.yml` runs migrations and the API, expecting PostgreSQL to be provided externally, for example by AWS RDS.

Example development database service:

```yaml
services:
  postgres:
    image: postgres:17
    container_name: taskflow_postgres
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    ports:
      - '5432:5432'
```

## Deployment

GitHub Actions workflows are configured for two AWS environments:

- `dev` branch pushes deploy to development via `.github/workflows/deploy-dev.yml`.
- Production deploy is manual from the Actions menu via `.github/workflows/deploy-prod.yml` and is guarded to run only from `main`.
- Common deployment steps are reused through `.github/workflows/deploy-reusable.yml`.
- CI runs tests and build on pushes and pull requests to `main` and `dev` via `.github/workflows/ci.yml`.

Deployment uses Docker images built on self-hosted GitHub runners. AWS setup notes are documented in `infra/aws/README.md`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and unlicensed.

## Support

For questions and support, please open an issue in the repository.
