# 🔥 FIREBASE AUTH SETUP - QUICK FIX

## The Error
`Firebase: Error (auth/configuration-not-found)`

This means Google Authentication isn't enabled in your Firebase project yet.

---

## 🚀 Quick Fix (5 minutes)

### Step 1: Go to Firebase Console
1. Open: https://console.firebase.google.com/
2. Click on your project: **koza-a7448**

### Step 2: Enable Google Authentication
1. In the left sidebar, click **"Authentication"** (or **"Build"** → **"Authentication"**)
2. Click **"Get started"** (if you see it)
3. Click on the **"Sign-in method"** tab at the top
4. Find **"Google"** in the list of providers
5. Click on **"Google"**
6. Toggle the **"Enable"** switch to ON
7. **IMPORTANT**: Select a "Support email" from the dropdown (use your email)
8. Click **"Save"**

### Step 3: Add Authorized Domain (for localhost)
1. Still in **Authentication** → **Settings** tab
2. Scroll to **"Authorized domains"**
3. `localhost` should already be there
4. If not, click **"Add domain"** and add `localhost`

### Step 4: Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## ✅ Verification

After completing the steps above:
1. Refresh your browser
2. Click "Sign in with Google"
3. You should see the Google sign-in popup
4. Complete the sign-in
5. You'll be redirected to the main app

---

## 🆘 Still Not Working?

### Check Firebase Console
- Make sure you're in the correct project (koza-a7448)
- Verify Google provider shows "Enabled" with a green checkmark
- Check that your email is listed as support email

### Check Browser Console
- Press F12 to open developer tools
- Look for any other error messages
- Share them if the problem persists

### Common Issues
- **Wrong project**: Make sure you're in koza-a7448
- **Not saved**: Make sure you clicked "Save" after enabling Google auth
- **Cache**: Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📸 Visual Guide

When you enable Google Auth, you should see:
```
Google
[Toggle: ON] ✓ Enabled
Support email: your-email@gmail.com
[Save button]
```

After saving, the Google row should have a green checkmark.
