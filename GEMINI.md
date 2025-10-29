# Project: Threadly

## Project Overview

Threadly is a full-stack web application designed to be a modern email client. It fetches emails from a user's Gmail account and displays them in a user-friendly, chat-like interface.

**Technologies Used:**

*   **Backend:** Node.js, Express.js
*   **Frontend:** React, Vite, TypeScript
*   **Authentication:** Google OAuth 2.0
*   **API:** Google Gmail API

**Architecture:**

The project is a monorepo with a separate backend and frontend.

*   **Backend (`/server`):** A Node.js server that handles user authentication with Google, fetches email data from the Gmail API, and exposes a RESTful API for the frontend.
*   **Frontend (`/threadly-client-web`):** A React application built with Vite that consumes the backend API to display emails to the user.

## Building and Running

This project is a monorepo that uses npm workspaces. The `packages` directory contains the `client` and `server` applications.

1.  **Install Dependencies for both packages:**
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    Create a `.env` file in the `packages/server` directory with the following variables:
    ```
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    REDIRECT_URI=http://localhost:3001/auth/google/callback
    ```

3.  **Run the Development Servers:**
    *   To start the backend server:
        ```bash
        npm run start:server
        ```
    *   To start the frontend client:
        ```bash
        npm run start:client
        ```

## Development Conventions

*   **Linting:** The frontend uses ESLint for code quality. You can run the linter with:
    ```bash
    cd threadly-client-web
    npm run lint
    ```
*   **Code Style:** The project uses modern JavaScript/TypeScript features. Follow the existing code style and conventions.
