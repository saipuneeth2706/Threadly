# Threadly Project

## Project Overview

This repository contains the source code for **Threadly**, an opinionated email client that transforms cluttered inboxes into a clean, intuitive, chat-based interface.

The project is divided into three main components:

*   **`web/`**: A Next.js application for the web interface.
*   **`mobile/`**: A native Android application (Kotlin/Compose).
*   **`backend/`**: A Node.js (NestJS) application that serves as the API and handles all business logic.

The backend is built with NestJS, a progressive Node.js framework for building efficient, reliable and scalable server-side applications.

## Building and Running

### Running the entire project

From the root directory, you can run the following commands to start the entire project at once:

```bash
# Starts the backend, web, and mobile applications in development mode.
npm run start:dev

# Starts the backend, web, and mobile applications in production mode.
npm start
```

### Backend

The backend is a NestJS application located in the `backend/` directory.

**Prerequisites:**

*   Node.js (v18 or higher)
*   npm

**Installation:**

```bash
cd backend
npm install
```

**Running the app:**

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

**Testing:**

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

### Frontend (Web & Mobile)

The web and mobile applications can be started from the root directory using the commands mentioned in the "Running the entire project" section. However, if you want to run them individually, you can use the following commands:

**Web:**

```bash
cd web
npm install
npm run dev
```

**Mobile:**

```bash
cd mobile
npm install
npm start
```

## Development Conventions

*   **Code Style:** The backend uses Prettier for code formatting and ESLint for linting. Run `npm run format` and `npm run lint` in the `backend` directory to format and lint the code.
*   **Branching:** (TODO: Define branching strategy, e.g., GitFlow)
*   **Commits:** (TODO: Define commit message conventions)