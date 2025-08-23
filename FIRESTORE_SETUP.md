# Firestore Database Setup Guide

This guide will help you set up Firebase Firestore with optimal indexing and data savings for the Tech Tour booking system.

## 🚀 Quick Setup

### 1. Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `bayAreaTechTour`
3. Navigate to **Firestore Database** in the left sidebar
4. Click **"Create database"**
5. Choose **"Start in production mode"**
6. Select a location (recommend: `us-central1` for best performance)

### 2. Deploy Security Rules

1. Install Firebase CLI if you haven't:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```

4. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 3. Deploy Indexes

Deploy the optimized indexes for better performance:
```bash
firebase deploy --only firestore:indexes
```

### 4. Seed the Database

Run the database seeding script to populate with initial data:
```bash
# Make the script executable
chmod +x scripts/seed-database.ts

# Run the seeding script
npx tsx scripts/seed-database.ts
```

## 📊 Database Structure

### Collections

#### `tours`
- **Purpose**: Store tour information
- **Indexes**: `active + popular + rating`, `active + company + rating`, `active + price`
- **Data Savings**: Efficient filtering and sorting

#### `available_slots`
- **Purpose**: Store available time slots for each tour
- **Indexes**: `tourId + date + time`, `tourId + date + availableSpots`
- **Data Savings**: Optimized date-based queries

#### `bookings`
- **Purpose**: Store user bookings
- **Indexes**: `userId + createdAt`, `userId + status + createdAt`
- **Data Savings**: User-specific queries with status filtering

#### `users`
- **Purpose**: Store user profiles and preferences
- **Access**: User can only access their own profile
- **Data Savings**: Personalized data storage

#### `reviews`
- **Purpose**: Store tour reviews and ratings
- **Indexes**: `tourId + rating + createdAt`, `userId + createdAt`
- **Data Savings**: Efficient review retrieval

## 🔒 Security Rules

The security rules ensure:
- ✅ **Authentication Required**: All operations require user authentication
- ✅ **Data Isolation**: Users can only access their own data
- ✅ **Admin Access**: Admins can manage all data
- ✅ **Tour Access**: All authenticated users can read tour data
- ✅ **Booking Protection**: Users can only manage their own bookings

## 📈 Performance Optimizations

### Indexing Strategy

1. **Compound Indexes**: Optimized for common query patterns
2. **Date-based Indexes**: Efficient date range queries
3. **User-specific Indexes**: Fast user data retrieval
4. **Status-based Indexes**: Quick filtering by booking status

### Data Savings Features

1. **Pagination**: Load data in chunks to reduce bandwidth
2. **Selective Queries**: Only fetch required fields
3. **Caching**: Client-side caching for frequently accessed data
4. **Batch Operations**: Efficient bulk data operations

### Query Optimization

```typescript
// Efficient tour queries
const tours = await BookingService.getTours({ 
  active: true, 
  popular: true 
})

// Date-based slot queries
const slots = await BookingService.getAvailableSlots(
  tourId, 
  startDate, 
  endDate
)

// User-specific booking queries
const bookings = await BookingService.getUserBookings(
  userId, 
  'confirmed'
)
```

## 🛠️ Monitoring & Analytics

### Firestore Usage Dashboard

Monitor your database usage in the Firebase Console:
1. Go to **Firestore Database** → **Usage** tab
2. Track read/write operations
3. Monitor storage usage
4. View query performance

### Cost Optimization

1. **Read Operations**: Use pagination and selective queries
2. **Write Operations**: Use batch operations for bulk updates
3. **Storage**: Compress data and remove unused fields
4. **Indexes**: Only create necessary indexes

## 🔧 Troubleshooting

### Common Issues

1. **Missing Indexes**: Firebase will show error links to create required indexes
2. **Permission Denied**: Check security rules and user authentication
3. **Query Performance**: Use the provided indexes and avoid complex queries
4. **Data Consistency**: Use batch operations for related data updates

### Performance Tips

1. **Limit Query Results**: Use `limit()` to restrict result size
2. **Use Indexes**: Always query on indexed fields
3. **Avoid Deep Queries**: Keep query depth minimal
4. **Cache Results**: Implement client-side caching

## 📱 Integration

The booking system is now fully integrated with Firestore:

- ✅ **Real-time Data**: Live updates for availability
- ✅ **User Authentication**: Secure user data access
- ✅ **Booking Management**: Complete booking lifecycle
- ✅ **Performance Optimized**: Fast queries with proper indexing
- ✅ **Cost Efficient**: Optimized for data savings

## 🚀 Next Steps

1. **Test the System**: Try booking a tour to verify everything works
2. **Monitor Usage**: Check Firestore usage in Firebase Console
3. **Scale as Needed**: Add more tours and slots as your business grows
4. **Backup Strategy**: Set up regular data backups

Your Firestore database is now ready for production use with optimal performance and data savings! 🎉
