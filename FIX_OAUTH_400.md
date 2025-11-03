# 🔧 Quick Fix for OAuth Error 400

## ✅ Good News

Your credentials are loaded correctly! The error is from Google's servers, not your app.

## 🎯 The Problem

The redirect URI in Google Cloud Console doesn't match what your app is sending.

## ⚡ Quick Fix (2 minutes)

### Step 1: Open Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

### Step 2: Find Your OAuth Client

Look for this Client ID in the list:
```
96922764379-e6l4aenal9tvs9up55mahvs60ce7lk6a.apps.googleusercontent.com
```

Click on it to edit.

### Step 3: Add Redirect URI

Find the "Authorized redirect URIs" section and click "ADD URI"

Enter EXACTLY this (no quotes, no spaces, exact spelling):
```
http://localhost:3000/api/gmail/auth/callback
```

### Step 4: Save

Click "SAVE" at the bottom of the page.

### Step 5: Wait 5 seconds

Google needs a moment to update (sometimes up to 5 minutes, usually instant).

### Step 6: Try again

Go back to your app (http://localhost:3000) and click "Sign in with Gmail" again.

---

## 🖼️ Visual Guide

In Google Cloud Console, you should see:

```
Authorized redirect URIs
┌─────────────────────────────────────────────────────────┐
│ http://localhost:3000/api/gmail/auth/callback           │
│                                                          │
│ + ADD URI                                               │
└─────────────────────────────────────────────────────────┘
```

**NOT:**
- ❌ `https://localhost:3000/...`
- ❌ `http://localhost:3000/api/gmail/auth/callback/`
- ❌ `http://127.0.0.1:3000/...`
- ❌ Anything with extra paths

---

## 🆘 Still Not Working?

### Check These:

1. **Is Gmail API enabled?**
   - Go to: https://console.cloud.google.com/apis/library
   - Search "Gmail"
   - Make sure it says "ENABLED"

2. **Are you using the right project?**
   - In Google Cloud Console, check the project dropdown at the top
   - Make sure it's the same project where you created the OAuth client

3. **Are the credentials correct?**
   - Your .env.local has: `96922764379-e6l4aenal9tvs9up55mahvs60ce7lk6a`
   - Make sure this matches what you see in Google Cloud Console

4. **Try creating a new OAuth client:**
   - In Google Cloud Console → Credentials
   - Delete the old one
   - Create a new "Web application" OAuth client
   - Copy the new Client ID and Secret to .env.local
   - Restart your dev server

---

## 📝 Your Current Config

From your .env.local:
```
Client ID: 96922764379-e6l4aenal9tvs9up55mahvs60ce7lk6a.apps.googleusercontent.com
Redirect URI: http://localhost:3000/api/gmail/auth/callback
```

**Make sure Google Cloud Console matches this EXACTLY!**

---

## ✅ Success Looks Like

When it works, you'll see:
1. Google sign-in page opens
2. You select your Google account
3. Permission screen asks: "Threadly would like to: Read and Send email"
4. You click "Allow"
5. You're redirected back to the app
6. Your inbox appears! 🎉

---

**That's it! This should fix your Error 400.** 🚀

