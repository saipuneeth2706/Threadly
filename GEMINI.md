# Threadly Project

## Table of Contents

*   [About](#about)
*   [Features](#features)
*   [Technologies](#technologies)
*   [Building and Running](#building-and-running)
*   [Testing](#testing)
*   [Gmail Integration](#gmail-integration)
*   [Development Conventions](#development-conventions)
*   [Contributing](#contributing)
*   [License](#license)

## About

Threadly is an opinionated email client that transforms your cluttered inbox into a clean, intuitive, chat-based interface. It's designed to help you manage your emails more efficiently and effectively.

## Features

*   **Chat-based interface:** View your emails as conversations, not as a long list of messages.
*   **Clean and intuitive design:** Focus on what matters most: your emails.
*   **Gmail integration:** Connect your Gmail account and start using Threadly in seconds.
*   **Cross-platform:** Use Threadly on the web, on your desktop, and on your mobile device.

## Technologies

*   **Backend:** Node.js, NestJS, Passport, Google APIs
*   **Web:** Next.js, React, TypeScript, Tailwind CSS
*   **Mobile:** React Native, TypeScript

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

## Testing

### Backend

```bash
# unit tests
npm run test --prefix backend

# e2e tests
npm run test:e2e --prefix backend

# test coverage
npm run test:cov --prefix backend
```

### Web

```bash
# lint
npm run lint --prefix web
```

### Mobile

```bash
# lint
npm run lint --prefix mobile

# test
npm run test --prefix mobile
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

*   **Code Style:**
    *   **Backend:** The backend uses Prettier for code formatting and ESLint for linting. Run `npm run format` and `npm run lint` in the `backend` directory to format and lint the code.
    *   **Web:** The web application uses ESLint for linting. Run `npm run lint` in the `web` directory to lint the code.
    *   **Mobile:** The mobile application uses Prettier and ESLint for code formatting and linting. Run `npm run lint` in the `mobile` directory to lint the code.
*   **Branching:** (TODO: Define branching strategy, e.g., GitFlow)
*   **Commits:** (TODO: Define commit message conventions)

## Contributing

Contributions are welcome! Please read the contributing guidelines before getting started.

## License

This project is licensed under the ISC License.
