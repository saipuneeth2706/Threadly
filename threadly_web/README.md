# Threadly - Gmail Chat Interface

Threadly is a privacy-focused email chat application that transforms your Gmail inbox into a modern, chat-like interface. Send and receive emails with the simplicity of a messaging app while keeping the security and privacy of email.

## Features

- 🎨 Modern chat-like interface for your Gmail inbox
- 🔒 Privacy-focused - uses Gmail's secure OAuth authentication
- 📧 Send and receive emails seamlessly
- 💬 Real-time conversation view
- 🎯 Thread-based organization
- 🔐 Secure - no data stored on external servers

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Cloud account with Gmail API enabled
- Gmail account for authentication

### Setup

1. **Clone and install dependencies:**

```bash
cd Threadly/threadly_web
npm install
```

2. **Set up Google Cloud credentials:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Gmail API
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Configure the consent screen if prompted
   - Choose "Web application" as the application type
   - Add authorized redirect URI: `http://localhost:3000/api/gmail/auth/callback`
   - Save your Client ID and Client Secret

3. **Configure environment variables:**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```
GMAIL_CLIENT_ID=your_client_id_here
GMAIL_CLIENT_SECRET=your_client_secret_here
GMAIL_REDIRECT_URI=http://localhost:3000/api/gmail/auth/callback
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Open your browser:**

Visit [http://localhost:3000](http://localhost:3000) and sign in with your Gmail account.

## How It Works

Threadly uses the Gmail API to fetch your emails and display them in a chat interface. When you send a message, it's sent as an email through your Gmail account. Your data remains private and secure - no emails are stored on our servers.

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Inline styles with modern CSS
- **Authentication:** Google OAuth 2.0
- **API:** Gmail REST API

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
