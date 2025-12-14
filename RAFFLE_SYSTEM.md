# Raffle System Documentation

## Overview
The raffle system allows admins to run a lottery draw on the admin dashboard where users earn raffle entries based on their accumulated points. 1 entry = 100 points.

## Prize Pool
The default prizes for this raffle are:
- **1x Apple iPad (A16)**
- **1x JBL Tune 720BT**
- **10x $10 Amazon Giftcards**

Total: 12 winners

## How It Works

### Entry Calculation
- Each user accumulates points by completing articles and sections
- Users earn **1 raffle entry per 100 points**
- Only users with 100+ points are eligible for the raffle
- Each entry represents one ticket in the draw

### Weighted Selection
- The raffle uses a weighted random selection algorithm
- Users with more points have more entries, so they have proportionally better odds
- Winners are selected one at a time from all available entries
- Once a user wins a prize, they can still be selected for additional prizes (entries are managed per-draw, not per-prize)

### Running the Raffle

#### 1. Access the Raffle Admin Page
- Log in as an admin user
- Go to your Dashboard (`/me`)
- Click **"Raffle"** in the Admin Panel section

#### 2. Initialize the Raffle
If this is the first time, click **"Initialize Raffle"** to set up the prize pool.

#### 3. View Entry Details (Optional)
- Click **"View Entry Details"** to see all eligible participants
- See how many points and entries each user has
- Users are sorted by number of entries (highest first)

#### 4. Roll the Raffle
- Click **"🎲 Roll Raffle"** to run the drawing
- The system will:
  - Calculate all eligible entries
  - Randomly select winners for each prize
  - Record the results in Firebase
  - Display all winners with their prize information

#### 5. View Results
- After rolling, all winners are displayed with:
  - Prize name
  - Winner name and email
  - Timestamp of when they won

#### 6. Reset (If Needed)
- Click **"Reset Raffle"** to clear all results and start fresh
- Confirmation dialog will appear to prevent accidental resets

## User Interface

### Prize Pool Card
Shows all available prizes with quantities:
```
🏆 Apple iPad (A16) ×1
🎧 JBL Tune 720BT ×1
💳 $10 Amazon Giftcard ×10
```

### Raffle Info Card
Displays:
- Points required per entry (100)
- Current raffle status (ACTIVE/COMPLETED)

### Entry Details Section
Scrollable list showing:
- User display name
- User email
- Total points earned
- Number of raffle entries
- Sorted by highest entries first

### Results Section
Shows all winners after rolling:
- Prize won
- Winner name and email
- Exact timestamp of selection

## Technical Details

### Database Structure
The raffle data is stored in Firebase Firestore at `aggregate/raffle`:

```typescript
{
  pointsPerEntry: 100,
  prizes: Prize[],
  results: RaffleResult[],
  active: boolean,
  createdAt: Timestamp
}
```

### Prize Type
```typescript
{
  id: string;           // Unique identifier
  name: string;         // Display name
  quantity: number;     // How many of this prize
  description: string;  // Full description
}
```

### Result Type
```typescript
{
  prizeId: string;      // Which prize was won
  prizeName: string;    // Prize display name
  winnerUid: string;    // User's Firebase UID
  winnerName: string;   // User's display name
  winnerEmail: string;  // User's email
  timestamp: Timestamp; // When they won
}
```

## Services

### raffleService.ts
Location: `/src/app/services/raffleService.ts`

Main functions:
- `initializeRaffle(prizes)` - Set up the raffle with prizes
- `getRaffleConfig()` - Get current raffle configuration
- `getRaffleEntries()` - Get all eligible entries with weighted data
- `rollRaffle()` - Run the draw and select winners
- `getRaffleResults()` - Get all recorded results
- `resetRaffle(prizes)` - Clear results and start over

## Component

### Admin Raffle Page
Location: `/src/app/admin/raffle/page.tsx`

Features:
- Admin authentication check
- Real-time raffle state management
- React Query for data fetching and mutation
- User-friendly UI with Tailwind CSS
- Error handling and success messages

## Customization

### Changing the Prizes
Edit the `DEFAULT_PRIZES` array in `/src/app/admin/raffle/page.tsx`:

```typescript
const DEFAULT_PRIZES: Prize[] = [
    {
        id: "prize-id",
        name: "Prize Name",
        quantity: 1,
        description: "Full prize description",
    },
    // Add more prizes...
];
```

### Changing Points Per Entry
Modify the hardcoded value `100` in `raffleService.ts`:
- `getRaffleEntries()` function
- Update `config.pointsPerEntry` in `initializeRaffle()`

## Important Notes

1. **Admin-Only Feature**: Only users with `admin: true` in their profile can access the raffle
2. **Immutable Results**: Once winners are selected, they're saved to Firebase and can only be cleared by resetting
3. **Real User Data**: The raffle uses actual user points from the `users` collection
4. **No Duplicate Removals**: The same user can win multiple prizes if they have enough entries

## Troubleshooting

### "No raffle entries available"
- This means no users have 100+ points yet
- Users need to complete articles and sections to earn points

### Results not appearing
- Click "Roll Raffle" button to run the drawing
- Results are stored in Firestore under `aggregate/raffle`

### Firebase permission errors
- Ensure your Firestore rules allow admins to read/write to `aggregate/raffle`
- Check that the user has `admin: true` in their profile

## Future Enhancements

Possible improvements:
- Export results to CSV/Excel
- Schedule automated raffle draws
- Per-user raffle history
- Prize customization UI in admin panel
- Raffle analytics and statistics
- Email notifications for winners
