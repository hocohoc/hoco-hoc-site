# Raffle System - Quick Reference Card

## 🎯 In 30 Seconds

**What is it?** A raffle system where users with 100+ points get raffle entries (1 entry per 100 points). Admins can roll a random draw to select winners for 12 prizes (1 iPad, 1 Headphones, 10 Giftcards).

**How do I use it?** 
1. Login as admin
2. Go to Dashboard (/me) → click "Raffle"
3. Click "Roll Raffle"
4. See who won

**Where is it?** `/admin/raffle`

---

## 👥 For Admins

### How to Access
```
Profile Dropdown → Dashboard (/me)
    ↓
Left Sidebar: "Admin Panel" → "Raffle"
    ↓
/admin/raffle page loads
```

### What You Can Do
| Action | Button | Result |
|--------|--------|--------|
| Setup | Initialize Raffle | Creates prize pool in Firebase |
| View | View Entry Details | See all users, points, entries |
| Run | 🎲 Roll Raffle | Randomly select 12 winners |
| Reset | Reset Raffle | Clear results, start over |

### Entry Calculation
```
User Points ÷ 100 = Raffle Entries

Example:
Sarah: 350 points → 3 entries (30% odds if 10 total entries)
Mike: 250 points → 2 entries (20% odds if 10 total entries)
Lisa: 100 points → 1 entry (10% odds if 10 total entries)
```

### Prizes (Fixed)
- 🎁 1x Apple iPad (A16)
- 🎧 1x JBL Tune 720BT
- 💳 10x $10 Amazon Giftcard

**Total: 12 winners**

---

## 🛠️ For Developers

### Files
```
src/app/services/raffleService.ts .......... Service layer
src/app/admin/raffle/page.tsx ............. Admin UI
src/app/me/me-nav.tsx ..................... Navigation (updated)
```

### Key Functions
```typescript
initializeRaffle()      // Setup raffle
getRaffleEntries()      // Get all eligible users
rollRaffle()           // Run the draw
getRaffleResults()     // Get winners
resetRaffle()          // Clear and start over
```

### Database Location
```
Firestore: aggregate/raffle
├── pointsPerEntry: 100
├── prizes: [iPad, JBL, GiftCard x10]
├── results: [winners array]
├── active: true/false
└── createdAt: timestamp
```

### Testing
```typescript
// Check if user qualifies
userPoints: 350
entries: Math.floor(350 / 100) = 3 ✓

// Check if raffle exists
getRaffleConfig() → returns config or null
```

### Customize Prizes
Edit `/src/app/admin/raffle/page.tsx`:
```typescript
const DEFAULT_PRIZES: Prize[] = [
    {
        id: "ipad",
        name: "Apple iPad (A16)",
        quantity: 1,
        description: "1x Apple iPad with A16 chip",
    },
    // ... more prizes
];
```

---

## 🔒 Firebase Setup

### Firestore Rules Needed
```javascript
// Admins can read/write raffle
match /aggregate/raffle {
  allow read, write: if userIsAdmin();
}

// Admins can read all users (for entry calculation)
match /users/{uid} {
  allow read: if userIsAdmin();
}
```

See `FIRESTORE_RULES.md` for complete setup.

---

## 📊 How It Works

### Algorithm (Simplified)
```
1. Get all users with 100+ points
2. For each user: create entry tickets (1 per 100 points)
3. Randomly pick winners:
   - Select random winner from pool
   - Award them a prize
   - Continue for all 12 prizes
4. Save results to Firebase
5. Display to admin
```

### Probability Example
```
4 Users:
- John: 400 pts = 4 tickets (40% chance each draw)
- Sarah: 300 pts = 3 tickets (30% chance each draw)
- Mike: 200 pts = 2 tickets (20% chance each draw)
- Lisa: 100 pts = 1 ticket (10% chance each draw)

12 draws (one per prize):
Expected: John wins ~5 times, Sarah ~3 times, Mike ~2 times, Lisa ~1-2 times
```

---

## 🚨 Troubleshooting

### Issue: "No raffle entries available"
**Cause**: No users have 100+ points yet
**Fix**: Wait for users to complete articles

### Issue: "Missing or insufficient permissions"
**Cause**: Firestore rules not set up or user not admin
**Fix**: 
1. Check user has `admin: true` in Firestore
2. Verify Firestore rules are published
3. Refresh page

### Issue: Can't see Raffle link
**Cause**: User is not an admin
**Fix**: Make sure `user.admin = true` in Firestore profile

### Issue: Results disappeared
**Cause**: You clicked "Reset Raffle"
**Fix**: Results are only stored in Firestore - if reset, they're gone. No way to recover.

---

## 📚 Documentation

| File | Purpose | For |
|------|---------|-----|
| RAFFLE_SETUP.md | How to use | Admins |
| RAFFLE_SYSTEM.md | Technical details | Developers |
| RAFFLE_VISUAL_GUIDE.md | Diagrams & flowcharts | Visual learners |
| FIRESTORE_RULES.md | Firebase security | DevOps |
| RAFFLE_IMPLEMENTATION.md | Complete overview | Everyone |

---

## 🎮 Example: Running a Raffle

**Scenario**: You have 4 users eligible

```
Step 1: Initialize
└─ Click "Initialize Raffle"
   └─ Prizes set: iPad, JBL, 10x Giftcards
   └─ Status: ACTIVE

Step 2: View Entries
└─ Click "View Entry Details"
   └─ John: 350 pts = 3 entries
   └─ Sarah: 300 pts = 3 entries
   └─ Mike: 200 pts = 2 entries
   └─ Total: 8 entries in pool

Step 3: Roll Raffle
└─ Click "🎲 Roll Raffle"
   └─ System randomly selects 12 winners
   └─ iPad → John
   └─ JBL → Sarah
   └─ Giftcard → Mike
   └─ Giftcard → John
   └─ ... (8 more winners)

Step 4: View Results
└─ All 12 winners displayed with:
   ├─ Prize name
   ├─ Winner name
   ├─ Winner email
   └─ Timestamp

Step 5: (Optional) Reset for Next Year
└─ Click "Reset Raffle"
└─ Confirm deletion
└─ Results cleared, ready for next raffle
```

---

## ✨ Features

- ✅ Weighted random selection (fair odds)
- ✅ Real user data integration
- ✅ Persistent results (Firebase)
- ✅ Admin-only access
- ✅ Detailed participant view
- ✅ Timestamped results
- ✅ Resettable for multiple rounds
- ✅ Beautiful Tailwind UI
- ✅ Error handling
- ✅ Loading states

---

## 🎯 Success Checklist

Before going live:
- [ ] Admin can access `/admin/raffle`
- [ ] Users have earned 100+ points
- [ ] "Initialize Raffle" works
- [ ] "View Entry Details" shows users
- [ ] "Roll Raffle" completes without errors
- [ ] Results display correctly
- [ ] Firestore rules are published
- [ ] Reset works for next round

---

## 📞 Quick Links

- **Firebase Console**: https://console.firebase.google.com/
- **App URL**: https://your-app.com/admin/raffle
- **Admin File**: `src/app/admin/raffle/page.tsx`
- **Service**: `src/app/services/raffleService.ts`

---

## 🎊 That's It!

You now have a complete raffle system. Just:
1. Initialize once
2. Let users earn points
3. Roll when ready
4. See winners

Enjoy! 🎉
