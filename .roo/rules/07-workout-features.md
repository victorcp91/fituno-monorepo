---
description:
globs:
alwaysApply: false
---

# Workout Feature Implementation Rules

## Exercise Types Implementation

1. **Exercise Categories**

   ```typescript
   type ExerciseType =
     | 'strength' // Resistido
     | 'isometric' // Isométrico
     | 'plyometric' // Pliométrico/HIIT
     | 'cardio_steady' // Cardio contínuo
     | 'cardio_hiit' // Cardio intervalado
     | 'mobility' // Mobilidade
     | 'circuit'; // Circuito composto
   ```

2. **Required Parameters**
   - Strength: sets, reps, load, rest
   - Isometric: sets, duration_sec, rest
   - Plyometric: sets, reps, rest
   - Cardio Steady: time_min or distance_km
   - Cardio HIIT: rounds, work_sec, rest_sec
   - Mobility: sets, hold_sec, rest, sides
   - Circuit: group_id, rounds, inter_rest_sec

## Workout Builder

1. **UI Components**

   - Use drag-and-drop interface
   - Implement exercise drawer
   - Show parameter modal
   - Display validation alerts

2. **Validation Rules**
   - Check volume limits (≤20 sets/muscle/week)
   - Validate equipment availability
   - Check rest periods
   - Validate parameter ranges

## Exercise Execution

1. **Progress Tracking**

   - Record sets completed
   - Track weights used
   - Monitor rest periods
   - Log total workout time

2. **Offline Support**
   - Cache current workout
   - Store progress locally
   - Queue sync operations
   - Handle conflicts

## Animation Integration

1. **Lottie Files**

   - Load from Supabase Storage
   - Cache for offline use
   - Show loading states
   - Handle playback errors

2. **Performance**
   - Lazy load animations
   - Implement proper caching
   - Handle memory usage
   - Clean up unused files

## Workout Templates

1. **Template Structure**

   - Support weekly templates
   - Allow day customization
   - Handle equipment substitution
   - Support exercise notes

2. **Version Control**
   - Track workout versions
   - Handle updates gracefully
   - Maintain history
   - Support rollback

## Progress Analytics

1. **Data Collection**

   - Track all workout metrics
   - Record substitutions
   - Log completion times
   - Store user feedback

2. **Visualization**
   - Show progress graphs
   - Display load trends
   - Highlight achievements
   - Compare to targets
