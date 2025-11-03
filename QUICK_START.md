# Threadly Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd threadly_web
npm install
```

### 2. Get Google OAuth Credentials
1. Visit https://console.cloud.google.com/
2. Create a new project
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/gmail/auth/callback`

### 3. Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### 4. Run!
```bash
npm run dev
```

Visit http://localhost:3000 and sign in with Gmail!

## 📁 Project Structure

```
threadly_web/
├── app/
│   ├── api/gmail/
│   │   ├── auth/              # OAuth authentication routes
│   │   ├── send/              # Send email API
│   │   └── threads/           # Fetch threads API
│   ├── components/
│   │   ├── ChatApp.tsx        # Main chat interface
│   │   ├── GmailLogin.tsx     # Login component
│   │   └── SendBox.tsx        # Message input box
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── lib/
│   └── gmail.ts               # Gmail API utilities
└── .env.local.example         # Environment template
```

## 🔐 Security Notes

- Tokens are stored in localStorage (client-side only)
- All API calls use Bearer token authentication
- No emails stored on server
- Full OAuth 2.0 flow

## 🛠️ Troubleshooting

**Build fails?**
```bash
npm run build
```

**Type errors?**
```bash
npx tsc --noEmit
```

**Missing credentials?**
Make sure `.env.local` exists and has all required variables.

**OAuth redirect error?**
Verify redirect URI in Google Cloud Console matches exactly.

## 📝 Key Features

✅ Gmail inbox in chat format
✅ Send emails as messages
✅ Thread-based conversations
✅ Dark mode UI
✅ Privacy-focused (no server storage)
✅ OAuth 2.0 authentication

Happy emailing! 📧💬
