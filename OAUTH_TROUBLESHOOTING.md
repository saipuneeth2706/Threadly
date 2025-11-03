# OAuth Error 400: Troubleshooting Guide

## Error: 400: invalid_request

This error typically occurs due to one of these issues:

### 1. **Redirect URI Mismatch** (Most Common!)

**Problem:** The redirect URI in Google Cloud Console doesn't match what your app is using.

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Check "Authorized redirect URIs"
6. Ensure you have EXACTLY this URI:
   ```
   http://localhost:3000/api/gmail/auth/callback
   ```

**Important:** 
- No trailing slashes!
- Must be `http://` not `https://`
- Must match exactly including port number

### 2. **Environment Variables Not Loaded**

**Check if .env.local exists and is formatted correctly:**

```bash
cd Threadly/threadly_web
cat .env.local
```

Should look like:
```
GMAIL_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-your-secret-here
GMAIL_REDIRECT_URI=http://localhost:3000/api/gmail/auth/callback
```

**Common mistakes:**
- ❌ Extra spaces around `=`
- ❌ Quotes around values (if you have them, remove them)
- ❌ Missing newline at end of file
- ❌ Using `.env` instead of `.env.local`

**Fix:**
```bash
# Restart your dev server after changing .env.local
npm run dev
```

### 3. **Wrong OAuth Client Type**

**Problem:** Using Desktop app credentials instead of Web application

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Make sure your OAuth client is type "Web application"
3. If it's "Desktop app", delete it and create a new "Web application" one

### 4. **Missing or Incorrect Client ID/Secret**

**Check:**
- Client ID should end with `.apps.googleusercontent.com`
- Client Secret should start with `GOCSPX-`
- Copy them EXACTLY from Google Cloud Console (no extra spaces)

### 5. **App Not Running on Correct Port**

**Check:**
```bash
# Make sure dev server is running on port 3000
npm run dev

# Should see: Ready on http://localhost:3000
```

## Step-by-Step Debugging

### Step 1: Verify .env.local file

Create/check the file:
```bash
cd Threadly/threadly_web
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### Step 2: Verify Google Cloud Setup

1. Visit: https://console.cloud.google.com/
2. Ensure Gmail API is **enabled**
3. Go to Credentials → OAuth 2.0 Client IDs
4. Copy Client ID and Client Secret

### Step 3: Verify Redirect URI

In Google Cloud Console, your redirect URI must be:
```
http://localhost:3000/api/gmail/auth/callback
```

**NOT:**
- `https://localhost:3000/...` 
- `http://localhost:3000/api/gmail/auth/callback/` (trailing slash)
- `http://127.0.0.1:3000/...`

### Step 4: Restart Server

After any .env.local changes:
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

### Step 5: Check Console Logs

Look at your terminal where `npm run dev` is running. You should see:
```
OAuth Config Check: {
  hasClientId: true,
  hasClientSecret: true,
  redirectUri: 'http://localhost:3000/api/gmail/auth/callback',
  clientIdLength: <some number>
}
```

If you see `false` for hasClientId or hasClientSecret, your .env.local isn't being loaded.

## Still Not Working?

### Try creating .env.local manually:

```bash
cd Threadly/threadly_web
nano .env.local  # or use any editor
```

Paste this EXACTLY (replace with your values):
```
GMAIL_CLIENT_ID=your-actual-client-id-here
GMAIL_CLIENT_SECRET=your-actual-secret-here
GMAIL_REDIRECT_URI=http://localhost:3000/api/gmail/auth/callback
```

Save and restart:
```bash
npm run dev
```

### Check if port 3000 is already in use:

```bash
lsof -i :3000
# If something is using port 3000, kill it or use a different port
```

### Verify Next.js is loading env vars:

Create a test API route to check:
```bash
# This is just for debugging
curl http://localhost:3000/api/gmail/auth
```

You should see JSON with an `authUrl` field, not an error about missing credentials.

## Contact Points

- Google Cloud Console: https://console.cloud.google.com/
- OAuth 2.0 Playground: https://developers.google.com/oauthplayground/
- Gmail API Docs: https://developers.google.com/gmail/api

Good luck! 🚀

