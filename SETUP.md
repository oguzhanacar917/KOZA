# KOZA - Setup Guide

## 🔧 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `koza-app` (or your preferred name)
4. Disable Google Analytics for now (optional)
5. Click "Create project"

### 2. Enable Google Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle **Enable**
4. Enter support email
5. Click **Save**

### 3. Register Web App

1. In Firebase Console, go to **Project settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Enter app nickname: `KOZA Web`
5. Click **Register app**
6. Copy the Firebase configuration object

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Fill in your Firebase credentials from step 3:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 📊 Google Analytics Setup

### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon)
3. Click **Create Property**
4. Enter property name: `KOZA`
5. Select timezone and currency
6. Click **Next**
7. Fill in business details
8. Click **Create**

### 2. Create Data Stream

1. Click **Web** under "Choose a platform"
2. Enter website URL: `http://localhost:5173` (for development)
3. Enter stream name: `KOZA Web`
4. Click **Create stream**
5. Copy the **Measurement ID** (starts with `G-`)

### 3. Add to Environment Variables

Add to your `.env` file:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🚀 Running the App

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Test Authentication

1. Visit `http://localhost:5173`
2. You should see the HomePage
3. Click "Google ile Başla"
4. Complete Google sign-in
5. You should be redirected to the main app

---

## 🔒 Security Notes

> **IMPORTANT**: Never commit your `.env` file to version control!

The `.gitignore` file should include:
```
.env
.env.local
```

For production deployment:
- Use environment variables in your hosting platform
- Enable Firebase App Check
- Set up proper CORS policies
- Use Firebase Security Rules

---

## 📝 Troubleshooting

### Firebase not configured error
- Make sure `.env` file exists
- Verify all Firebase credentials are correct
- Restart the dev server after adding `.env`

### Google sign-in fails
- Check Firebase Console → Authentication → Sign-in method
- Verify Google provider is enabled
- Check browser console for errors

### Analytics not tracking
- Verify GA4 Measurement ID is correct
- Check browser console for initialization messages
- Use GA4 DebugView to see real-time events

---

## 🎯 Next Steps

After setup:
1. Test authentication flow
2. Verify analytics tracking in GA4 dashboard
3. Create a story or game to test full functionality
4. Check GA4 for custom events (story_created, game_created, etc.)

For production:
1. Update Firebase authorized domains
2. Set up proper environment variables
3. Configure Firebase Security Rules
4. Enable Firebase App Check
5. Set up production GA4 data stream
