# Quick Index Creation Guide

## 🚨 Missing Index Error Fix

You're getting an index error because Firestore needs composite indexes for complex queries. Here's how to fix it quickly:

### Option 1: Use the Direct Link (Fastest)

Click this link to create the missing index directly:
```
https://console.firebase.google.com/v1/r/project/verifyme-1c6b2/firestore/indexes?create_composite=Ckxwcm9qZWN0cy92ZXJpZnltZS0xYzZiMi9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvdG91cnMvaW5kZXhlcy9fEAEaCgoGYWN0aXZlEAEaCwoHcG9wdWxhchACGgoKBnJhdGluZxACGgwKCF9fbmFtZV9fEAI
```

### Option 2: Manual Creation

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `verifyme-1c6b2`
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **"Create index"**
5. Configure the index:
   - **Collection ID**: `tours`
   - **Fields**:
     - `active` (Ascending)
     - `popular` (Descending)
     - `rating` (Descending)
   - **Query scope**: Collection

### Option 3: Deploy All Indexes

If you have Firebase CLI installed:

```bash
# Deploy all indexes at once
firebase deploy --only firestore:indexes
```

## 📋 Required Indexes

The following indexes need to be created:

### 1. Tours Collection
- `active + popular + rating` (for filtering popular tours)
- `active + company + rating` (for company-specific queries)
- `active + price` (for price filtering)

### 2. Available Slots Collection
- `tourId + date + time` (for date/time queries)
- `tourId + date + availableSpots` (for availability checks)

### 3. Bookings Collection
- `userId + createdAt` (for user booking history)
- `userId + status + createdAt` (for filtered booking history)

## ⏱️ Index Building Time

- **Small datasets** (< 1000 documents): 1-5 minutes
- **Medium datasets** (1000-10000 documents): 5-15 minutes
- **Large datasets** (> 10000 documents): 15-60 minutes

## 🔄 Temporary Workaround

While indexes are building, the app will use fallback queries that work without indexes. The functionality will still work, but may be slower.

## ✅ Verification

Once indexes are built, you should see:
- No more index errors in the console
- Faster query performance
- All booking features working smoothly

## 🆘 Still Having Issues?

If you continue to see index errors:

1. **Check index status** in Firebase Console → Firestore → Indexes
2. **Wait for completion** - indexes take time to build
3. **Clear browser cache** and refresh the page
4. **Check Firebase project** - ensure you're using the correct project

The app includes fallback mechanisms, so it should work even while indexes are building! 🚀
