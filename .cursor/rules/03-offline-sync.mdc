---
description: 
globs: 
alwaysApply: false
---
# Offline Support and Data Synchronization

## Offline Data Storage

1. **Required Offline Data**
   - Current week's workouts
   - Exercise animations for current workouts
   - User profile and settings
   - Essential UI assets and translations

2. **Storage Methods**
   - Use Expo SQLite for structured data
   - Use Expo FileSystem for media cache
   - Use Expo SecureStore for sensitive data
   - NO use of plain AsyncStorage for critical data

## Synchronization Rules

1. **Data Sync Strategy**
   - Mark offline changes with `synced: false` flag
   - Include local timestamp with offline changes
   - Implement exponential backoff for sync retries
   - Use "last write wins" conflict resolution

2. **Progress Tracking**
   - Cache workout progress locally
   - Track sync status of each workout session
   - Allow manual sync trigger in UI
   - Show clear sync status indicators

## Offline Features

1. **Workout Execution**
   - Allow complete workout execution offline
   - Store progress locally until sync possible
   - Show clear offline mode indicators
   - Cache exercise animations for offline use

2. **Chat Features**
   - Queue messages when offline
   - Show message status (sending/error)
   - Implement retry mechanism
   - Clear queue status indicators

## Error Handling

1. **Sync Errors**
   - Show clear error messages
   - Implement automatic retry logic
   - Allow manual retry of failed syncs
   - Log sync failures for debugging

2. **Data Integrity**
   - Validate data before sync
   - Handle partial sync failures
   - Preserve local changes until sync
   - Implement data recovery mechanisms

## Cache Management

1. **Cache Rules**
   - Clear obsolete data after 7 days
   - Clear cache on trainer change
   - Clear cache on logout
   - Implement cache size limits

2. **Media Cache**
   - Cache exercise animations selectively
   - Implement cache cleanup strategy
   - Show placeholders for uncached media
   - Handle cache failures gracefully

## Performance

1. **Optimization Rules**
   - Minimize data storage size
   - Implement efficient queries
   - Use appropriate indexes
   - Regular cleanup of unused data

2. **Battery Considerations**
   - Efficient sync scheduling
   - Minimize background operations
   - Optimize network requests
   - Handle low battery scenarios
