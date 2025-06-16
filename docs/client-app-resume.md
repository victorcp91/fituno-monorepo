# Fituno Client App - Wireframe Construction Guide

## Overview

Fituno mobile app (Expo/React Native) for fitness clients with offline-first
approach, multi-language support, and comprehensive workout execution
capabilities.

## Screen Architecture & Navigation

### Authentication Flow (US-AUTH-01 to US-AUTH-09)

- **Login Screen**: Email/password fields, social login buttons
  (Google/Facebook), "Forgot Password" link, Terms acceptance checkbox
- **Registration Screen**: Name, email, password fields, social options, email
  verification prompt
- **Password Reset**: Email input, confirmation message, reset link handling
- **Email Verification**: Verification pending screen, resend option, success
  confirmation

### Main Navigation Structure

- **Tab Navigation**: Home, Progress, Chat, Profile (bottom tabs with badges)
- **Home Screen States**:
  - No workout: Warning card with message
  - Workout available: Today's workout card, session list
  - Completed: Progress summary, options (redo/advance/recover)
- **Header Elements**: Trainer name/avatar, sync status indicator, offline badge

### Anamnese Questionnaire Screens (US-ANA-01 to US-ANA-04)

- **Welcome Screen**: Purpose explanation, "Start Questionnaire" button
- **Question Screens** (10 screens): Progress indicator, question text,
  selection options (radio/checkbox), navigation buttons
- **Key Question Types**:
  1. Objectives (radio): Weight loss, Hypertrophy, Conditioning, Rehabilitation,
     Health maintenance
  2. Experience (radio): Beginner, Intermediate, Advanced
  3. Frequency (radio): 1x to 5+ per week
  4. Muscle Focus (checkbox, max 3): Chest, Back, Legs, Glutes, Biceps, Triceps,
     Shoulders, Abs
  5. Injuries (checkbox): Spine, Shoulder, Knee, Ankle, Elbow, Hip, None
  6. Medical Conditions (checkbox): Hypertension, Diabetes, Heart problems,
     None, Other
  7. Training Time (radio): Morning, Afternoon, Evening, Varies
  8. Equipment Access (radio): Full gym, Limited gym, Home weights, Bodyweight
     only
- **Completion Screen**: Summary, submit confirmation

### Workout Execution Interface (US-EXE-01 to US-EXE-05)

- **Session Categories**: Visual cards for Stretching, Strength, Cardio, HIIT,
  Mobility
- **Exercise List**: Exercise name, animation thumbnail, sets/reps/weight
  display, completion checkboxes
- **Exercise Detail View**:
  - Exercise animation (Lottie player)
  - Parameters display (sets, reps, weight, rest time, RPE/RIR, notes)
  - Set tracking table with checkboxes and editable weight fields
  - Rest timer with start/stop/reset buttons
  - Substitution button (shows filtered alternatives)
- **Session Progress**: Progress bar, completed/total sets, session timer
- **Workout Completion**: Manual completion button, feedback form
  (light/ideal/heavy + optional comment)

### Progress & History Screens (US-PRO-01 to US-PRO-03)

- **Progress Dashboard**: Weekly summary cards, recent workouts list, photo
  upload button
- **Exercise History**: Search/filter, exercise list with progression graphs
- **Exercise Detail**: Load/rep charts, best records, workout history for
  specific exercise
- **Photo Progress**: Grid view, before/after comparisons, upload interface

### Chat Interface (US-CHAT-01 to US-CHAT-04)

- **Chat List**: Conversation with trainer, unread badges, last message preview
- **Chat Screen**: Message bubbles, exercise reference tags, input field with
  attachment button
- **Exercise Context**: "Mentioned [Exercise Name]" tags in messages, exercise
  icon display
- **Offline Indicators**: Message status (sending, sent, failed), retry buttons

### Profile & Settings (US-I18N-01 to US-I18N-04)

- **Profile Screen**: Avatar, name, edit button, trainer info, plan status
- **Settings**: Language selector, unit preferences (kg/lb, km/mi), legal
  document links
- **Account Management**: Edit profile, change password, logout

## UI Components & Visual Elements

### Cards & Containers

- **Workout Cards**: Exercise image, title, parameters, progress indicators
- **Status Cards**: Completion status, warnings, success messages
- **Info Cards**: Anamnese progress, sync status, offline notifications

### Input Elements

- **Forms**: Text inputs with validation, dropdown selectors, radio groups,
  checkboxes
- **Sliders**: Weight/rep adjustments, progress selectors
- **Timers**: Circular progress, play/pause controls, reset buttons

### Navigation & Actions

- **Bottom Tabs**: Icons with badges, active state indicators
- **FAB**: Primary actions (start workout, new message, add progress photo)
- **Action Sheets**: Exercise substitution, workout options
- **Swipe Actions**: Mark sets complete, message actions

### Feedback & States

- **Loading States**: Skeleton screens, spinners, progress bars
- **Empty States**: No workouts, no progress, no messages
- **Error States**: Network errors, sync failures, validation errors
- **Success States**: Workout completed, anamnese submitted, message sent

### Visual Hierarchy

- **Typography**: Titles, subtitles, body text, captions with Material Design
  scale
- **Colors**: Primary blue (#2b85ff), success green (#11b683), warning yellow
  (#dfb725), error red (#e34b51)
- **Icons**: Material Community Icons, exercise category icons, status
  indicators
- **Spacing**: Consistent margins/padding following 8px grid system

## User Interaction Patterns

### Gestures & Controls

- **Tap**: Primary actions, navigation, selections
- **Long Press**: Context menus, quick actions
- **Swipe**: Page navigation, action reveals, dismissals
- **Pull to Refresh**: Data sync, content updates
- **Scroll**: List navigation, content consumption

### Input Validation

- **Real-time**: Email format, password strength, required fields
- **Form Submission**: Complete validation with error highlighting
- **Inline Feedback**: Success checkmarks, error icons, helper text

### Responsive Behavior

- **Adaptive Layouts**: Phone/tablet considerations, orientation changes
- **Content Scaling**: Text size preferences, accessibility compliance
- **Touch Targets**: Minimum 44px hit areas, adequate spacing

## Offline Support & Synchronization (US-OFF-01 to US-OFF-04)

### Visual Indicators

- **Connection Status**: Header badge (online/offline/syncing)
- **Data Freshness**: Last sync timestamp, outdated content warnings
- **Sync Progress**: Progress bars, retry buttons, error notifications

### Cached Content Management

- **1-week workout cache**: Local storage with expiration indicators
- **Media caching**: Exercise animations, progress photos
- **Conflict Resolution**: "Last write wins" with user notification

## Technical Stack & Performance

### Framework Implementation

- **Expo/React Native**: Cross-platform mobile development
- **React Native Paper**: Material Design components with theming
- **React Query**: Server state management with caching strategies
- **Supabase Auth**: Authentication with social providers

### Performance Optimizations

- **FlatList**: Virtualized scrolling for large datasets
- **Skeleton Loaders**: Progressive loading states
- **Image Optimization**: Compressed uploads, lazy loading
- **Animation Performance**: Lottie with fallback handling

## Edge Cases & Error Handling

### Connection States

- **Offline Mode**: Gray headers, sync pending indicators, cached content notice
- **Poor Connection**: Loading states, retry options, timeout handling
- **Sync Conflicts**: Last-write-wins resolution, user notification

### Data States

- **No Anamnese**: Blocked workout access, completion prompt
- **No Workouts**: Waiting for trainer message, contact trainer button
- **Expired Workouts**: Warning banner, extension request option
- **Inactive Client**: Access restriction notice, contact information

### App States

- **Fresh Install**: Onboarding flow, tutorial highlights
- **App Updates**: Force update prompts, feature announcements
- **Background/Foreground**: State preservation, data refresh
- **Push Notifications**: In-app handling, action responses

## Quality Requirements (US-NFR-01 to US-NFR-05)

### Security Implementation

- **JWT Storage**: SecureStore for tokens, automatic refresh
- **Data Protection**: RLS enforcement, encrypted communications
- **Privacy Compliance**: LGPD/GDPR adherence, data minimization

### Performance Targets

- **Test Coverage**: ≥70% automated testing
- **Load Times**: <3s initial load, <1s navigation
- **Offline Resilience**: 1-week data availability
- **Memory Usage**: Optimized for low-end devices

This comprehensive guide provides detailed specifications for creating
wireframes that cover all user journeys, UI components, and technical
requirements for the Fituno client mobile application.
