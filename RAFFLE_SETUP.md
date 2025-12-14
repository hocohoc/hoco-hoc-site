# Raffle System - Quick Setup Guide

## What's Been Added

1. **raffleService.ts** - Backend service for raffle logic
2. **admin/raffle/page.tsx** - Admin UI for managing the raffle
3. **Updated me-nav.tsx** - Added navigation links for admins

## How to Use

### Step 1: Access the Raffle
1. Log in as an admin user
2. Click on your profile at the top right
3. Go to **Dashboard** (`/me`)
4. In the left sidebar, under "Admin Panel", click **"Raffle"**

### Step 2: Initialize the Raffle (First Time Only)
- Click **"Initialize Raffle"** button
- This sets up the 3 prizes:
  - 1x Apple iPad (A16)
  - 1x JBL Tune 720BT  
  - 10x $10 Amazon Giftcards

### Step 3: Check Eligible Participants
- Click **"View Entry Details"** to see:
  - All users with 100+ points
  - How many raffle entries each user has
  - Their email and point totals

### Step 4: Run the Raffle Drawing
- Click **"🎲 Roll Raffle"** to randomly select winners
- The system will:
  - Use weighted selection (more points = better odds)
  - Pick winners for all 12 prizes
  - Show results immediately

### Step 5: View Winners
- Results appear at the bottom showing:
  - What prize they won
  - Their name and email
  - Exact date/time they won

## How Entries Work

**Users earn raffle entries based on points:**
- 1 entry = 100 points
- A user with 500 points = 5 entries
- A user with 250 points = 2 entries (rounded down)
- Only users with 100+ points can enter

## Example

**User scenarios:**
- John: 350 points = 3 entries (chances ∝ 3/total)
- Sarah: 200 points = 2 entries (chances ∝ 2/total)
- Mike: 100 points = 1 entry (chances ∝ 1/total)

If total entries = 100, Sarah has a 2% chance to win each prize.

## Resetting the Raffle

If you need to run the raffle again:
1. Click **"Reset Raffle"**
2. Confirm the action
3. All previous results are cleared
4. Click **"Roll Raffle"** again to run a new draw

## Prize Pool

The prizes are currently hardcoded in the admin page. To change them:

1. Edit `/src/app/admin/raffle/page.tsx`
2. Find the `DEFAULT_PRIZES` array (near the top)
3. Modify the prizes, quantities, or descriptions
4. Save and refresh

Example:
```typescript
const DEFAULT_PRIZES: Prize[] = [
    {
        id: "ipad",
        name: "Apple iPad (A16)",
        quantity: 1,
        description: "1x Apple iPad with A16 chip",
    },
    {
        id: "jbl",
        name: "JBL Tune 720BT",
        quantity: 1,
        description: "1x JBL Tune 720BT Headphones",
    },
    {
        id: "giftcard",
        name: "$10 Amazon Giftcard",
        quantity: 10,
        description: "10x $10 Amazon Giftcards",
    },
];
```

## Data Storage

All raffle data is stored in Firebase Firestore:
- Location: `aggregate/raffle` document
- Includes: Prize definitions, configuration, and all results
- Admin-only access

## Troubleshooting

**"No raffle entries available"**
→ Wait for users to complete more articles/sections to earn points

**Can't see the Raffle link**
→ Make sure you're logged in as an admin user

**Results disappeared**
→ You may have hit "Reset Raffle". Results are stored in Firestore - if lost, contact developer

## Questions?

Refer to [RAFFLE_SYSTEM.md](./RAFFLE_SYSTEM.md) for full technical documentation.
