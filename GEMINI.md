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

## Gmail Integration

The backend supports retrieving emails from a user'''s Gmail inbox using the Gmail API and OAuth 2.0.

### 1. Google Cloud Project Setup

1.  **Go to the Google Cloud Console:** [https://console.cloud.google.com/](https://console.cloud.google.com/)
2.  **Create a new project.**
3.  **Enable the Gmail API:** In the project dashboard, go to "APIs & Services" > "Library". Search for "Gmail API" and enable it.
4.  **Create OAuth 2.0 Credentials:**
    *   Go to "APIs & Services" > "Credentials".
    *   Click "Create Credentials" and select "OAuth client ID".
    *   Choose "Web application" as the application type.
    *   Under "Authorized redirect URIs", add `http://localhost:3000/auth/google/callback`.
5.  **Copy your Client ID and Client Secret.**

### 2. Backend Configuration

1.  In the `backend` directory, create a `.env` file.
2.  Add your Google API credentials to the `.env` file:

    ```
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
    ```

### 3. Running the Authentication Flow

1.  **Start the backend:**
    ```bash
    cd backend
    npm run start:dev
    ```
2.  **Log in with Google:**
    *   Open your browser and go to `http://localhost:3000/auth/google`.
    *   Log in to your Google account and grant the requested permissions.
    *   You will be redirected to the callback URL, which will display a JSON object containing your user information and an `accessToken`.

### 4. Fetching Emails

1.  **Copy the `accessToken`** from the JSON response in the previous step.
2.  Use an API client (like Postman or curl) to make a GET request to the following endpoint:
    ```
    http://localhost:3000/gmail/emails
    ```
3.  Include an `Authorization` header in your request:
    ```
    Authorization: Bearer YOUR_ACCESS_TOKEN
    ```
4.  The response will contain a list of emails from your Gmail inbox.

## Development Conventions

*   **Code Style:** The backend uses Prettier for code formatting and ESLint for linting. Run `npm run format` and `npm run lint` in the `backend` directory to format and lint the code.
*   **Branching:** (TODO: Define branching strategy, e.g., GitFlow)
*   **Commits:** (TODO: Define commit message conventions)
