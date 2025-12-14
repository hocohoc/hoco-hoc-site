# Firebase Firestore Rules for Raffle System

## Required Firestore Rules

Add these rules to your Firebase Firestore Security Rules to enable the raffle system:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Existing rules for users...
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
    }

    // NEW: Raffle rules
    match /aggregate/raffle {
      // Allow admins to read and write raffle config
      allow read, write: if request.auth != null 
                         && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                         && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
      
      // Allow all authenticated users to read (optional - for leaderboard)
      // allow read: if request.auth != null;
    }

    // Allow admins to read all user data (for raffle entry calculation)
    match /users/{uid} {
      allow read: if request.auth != null 
                   && exists(/databases/$(database)/documents/users/$(request.auth.uid))
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }

    // Other existing rules...
    match /articles/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }

    match /sections/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }
  }
}
```

## What These Rules Do

### Raffle Document Access
```javascript
match /aggregate/raffle {
  allow read, write: if request.auth != null 
                     && get(...users/$(uid)).data.admin == true;
}
```
- **What it allows**: Admins can read and write to the raffle configuration
- **What it blocks**: Non-admins cannot access raffle data
- **Operations covered**: Initialize, roll, reset, view results

### User Data for Raffle (Read-only for admins)
```javascript
match /users/{uid} {
  allow read: if request.auth != null 
              && get(...users/$(uid)).data.admin == true;
}
```
- **What it allows**: Admins can read all user profiles to calculate raffle entries
- **What it blocks**: Users cannot read other user profiles, admins cannot modify
- **Purpose**: Fetch scores for entry calculation

## Step-by-Step Setup

1. **Go to Firebase Console**
   - Navigate to your project
   - Go to **Firestore Database** → **Rules**

2. **Replace the rules**
   - Copy the rules above
   - Paste into the Rules editor
   - Make sure your existing rules for users/articles/sections are preserved

3. **Publish**
   - Click **Publish** button
   - Wait for confirmation (usually 1-2 seconds)

4. **Test the Raffle**
   - Log in as an admin
   - Navigate to `/me` → Raffle
   - Try to initialize, view entries, and roll the raffle
   - Should all work without permission errors

## Troubleshooting

### "Missing or insufficient permissions"
**Problem**: You get this error when trying to access the raffle

**Solution**:
1. Verify your user has `admin: true` in their Firestore profile
2. Check that your Firestore rules are published correctly
3. Wait 30 seconds and refresh the page (rules can take a moment to apply)
4. Check the browser console for detailed error messages

### "Document not found"
**Problem**: The raffle document doesn't exist yet

**Solution**:
- Click "Initialize Raffle" button to create it
- Or manually create document `aggregate/raffle` with initial data

### Admin can't read user data
**Problem**: Can't see raffle entries

**Solution**:
- Make sure the user read rule allows admins to access all user documents
- The rule should be at `/users/{uid}` level, not `/users/{document=**}`

## Security Considerations

✅ **Good Security Practices**
- Only admins can modify raffle settings
- User data is read-only for raffle purposes
- All operations are authenticated
- Results are audit-logged with timestamps

⚠️ **Things to Remember**
- Keep your admin list small and verified
- Regularly audit who has admin access
- Store raffle results (they can be cleared if reset)
- Test your Firestore rules in a staging environment first

## Database Path Reference

### Raffle Configuration
```
Collection: aggregate
Document: raffle
Path: aggregate/raffle

Structure:
{
  pointsPerEntry: 100,
  prizes: [{id, name, quantity, description}, ...],
  results: [{prizeId, prizeName, winnerUid, winnerName, winnerEmail, timestamp}, ...],
  active: true,
  createdAt: Timestamp
}
```

### User Profiles (Read for raffle calculation)
```
Collection: users
Document: {uid}
Path: users/{uid}

We read:
- displayName
- email
- scores: {sectionId: points, ...}
- admin (to verify)
```

## Testing the Rules

You can test your rules using the Firestore Simulator:

1. Go to **Firestore Rules** → **Rules playground** (at the bottom)
2. Set up test data:
   ```
   Service: Cloud Firestore
   User UID: test-admin-uid
   Authentication: Signed in
   ```
3. Test query:
   ```javascript
   // Should succeed (admin reading raffle)
   match /aggregate/raffle {
     allow read, write: if request.auth.uid == 'test-admin-uid';
   }
   ```

## Common Firestore Structures

If you don't already have an `aggregate` collection, here's what it should look like:

### Step 1: Manually Create (if needed)
1. Go to Firestore Console
2. Click **+ Create collection**
3. Collection ID: `aggregate`
4. Document ID: `stats` (for existing stats)
5. Document ID: `raffle` (for raffle data)

### Step 2: Let App Initialize
- Just click "Initialize Raffle" in the admin panel
- The app will auto-create `aggregate/raffle` with correct structure

## Reference Links

- [Firebase Firestore Rules Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Firestore Data Structure Guide](https://firebase.google.com/docs/firestore/manage-data)
- [Firebase Console Rules Editor](https://console.firebase.google.com/)

## Questions or Issues?

If you encounter permission issues:
1. Check your Firestore rules are published
2. Verify the user has `admin: true`
3. Check browser console for Firebase errors
4. Ensure your Firebase project is configured in `firebase/config.ts`
