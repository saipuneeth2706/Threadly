# Threadly Project

## Project Overview

This repository contains the source code for **Threadly**, an opinionated email client that transforms cluttered inboxes into a clean, intuitive, chat-based interface.

The project is divided into three main components:

*   **`web/`**: A Next.js application for the web interface.
*   **`mobile/`**: A native Android application (Kotlin/Compose).
*   **`backend/`**: A Node.js (NestJS) application that serves as the API and handles all business logic.

The backend is built with NestJS, a progressive Node.js framework for building efficient, reliable and scalable server-side applications.

## Building and Running

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

**TODO:** Add build and run instructions for the web and mobile applications once they are created.

## Development Conventions

*   **Code Style:** The backend uses Prettier for code formatting and ESLint for linting. Run `npm run format` and `npm run lint` in the `backend` directory to format and lint the code.
*   **Branching:** (TODO: Define branching strategy, e.g., GitFlow)
*   **Commits:** (TODO: Define commit message conventions)