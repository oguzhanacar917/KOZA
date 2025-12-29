# 🔥 Firestore Database Setup

## Quick Setup (5 minutes)

### Step 1: Enable Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **koza-a7448**
3. Click **"Firestore Database"** in the left sidebar
4. Click **"Create database"**
5. Choose **"Start in production mode"**
6. Select region: **us-central** (or closest to your users)
7. Click **"Enable"**

### Step 2: Set Security Rules

1. In Firestore, click the **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## ✅ What This Enables

### Automatic Data Sync
- ✅ User profile (XP, level, achievements)
- ✅ All stories and games
- ✅ Real-time updates across devices
- ✅ Automatic backup to cloud

### First Sign-In
- Migrates local data to cloud
- Shows "Data Synced" toast

### Subsequent Sign-Ins
- Loads data from cloud
- Shows "Data Loaded" toast
- Syncs in real-time

### Cross-Device Sync
1. Sign in on Device A → Create story
2. Sign in on Device B → Story appears automatically
3. Update on Device B → Device A updates in real-time

---

## 🧪 Testing

### Test 1: First Sign-In (Migration)
1. Have some local stories
2. Sign in with Google
3. Should see "Data Synced" toast
4. Check Firestore Console → Data should be there

### Test 2: Load from Cloud
1. Clear browser data (or use incognito)
2. Sign in with same account
3. Should see "Data Loaded" toast
4. All stories should appear

### Test 3: Real-Time Sync
1. Open app in two browser tabs
2. Create story in Tab 1
3. Tab 2 should update automatically

### Test 4: Offline Mode
1. Create story while online
2. Go offline (disable network)
3. Create another story
4. Go online → Should sync automatically

---

## 📊 Firestore Structure

```
users/
  {userId}/
    data/
      profile/
        - xp: 850
        - level: 1
        - totalXP: 850
        - achievements: []
        - ...
    
    stories/
      {storyId}/
        - title: "Story Title"
        - content: "..."
        - type: "story" | "game"
        - createdAt: timestamp
        - ...
```

---

## 🔍 Verify in Firebase Console

1. Go to Firestore Database
2. You should see:
   - `users` collection
   - Your user ID as a document
   - `data` and `stories` subcollections

---

## 💡 Features

### Automatic Migration
- First sign-in migrates localStorage to cloud
- No data loss
- Seamless transition

### Real-Time Sync
- Changes sync instantly across devices
- Uses Firestore real-time listeners
- No manual refresh needed

### Offline Support
- Works offline (uses localStorage)
- Syncs when connection restored
- Graceful error handling

### Conflict Resolution
- Cloud data takes precedence
- Timestamp-based merging
- User notified of conflicts

---

## 🚨 Troubleshooting

### "Sync Failed" Toast
- Check Firestore is enabled
- Verify security rules are published
- Check browser console for errors

### Data Not Syncing
- Make sure you're signed in
- Check Firestore Console for data
- Verify security rules allow access

### Permission Denied
- Check security rules
- Verify user is authenticated
- Ensure userId matches in rules

---

## 💰 Cost

### Free Tier (Generous)
- **Reads**: 50,000/day
- **Writes**: 20,000/day
- **Storage**: 1 GB

### Typical Usage
- Sign in: ~2 reads
- Create story: 1 write
- Load stories: ~10 reads
- Real-time updates: Free!

**You'll stay well within free tier for personal use.**

---

## 🎯 Next Steps

After enabling Firestore:
1. Sign in to test migration
2. Create a story
3. Check Firestore Console
4. Sign in on another device
5. Verify data syncs

**That's it! Your data is now cloud-backed and synced across devices!** 🎉
