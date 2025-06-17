# Fituno Client App Documentation (MVP)

## 1. Overview

Fituno is a fitness training platform with a dedicated mobile application for
students/clients built with Expo/React Native. The mobile app allows students to
receive personalized workouts from their trainers, execute training sessions,
track progress, and communicate with their trainers.

### Key Features

- **Platform**: Mobile app (Expo/React Native)
- **Target Users**: Students/Clients who receive training programs
- **Core Purpose**: Execute workouts, track progress, communicate with trainers
- **Authentication**: Supabase Auth with email/password and social login
- **Offline Support**: Essential functionality available without internet

---

## 2. Authentication & Account Management

### 2.1 Login and Registration

**Epic Reference**: Epic 1 – Authentication & Account Management

- **Email/Password Login** (US-AUTH-01 - Must)

  - Login via email and password through Supabase Auth
  - Secure authentication with session management

- **Social Login** (US-AUTH-02 - Should)

  - Login with Google and Facebook
  - Quick access without creating new passwords
  - Avatar synchronization from social profiles

- **Email Verification** (US-AUTH-03 - Must)

  - Automatic verification email upon registration
  - Account access blocked until email is verified
  - Security protection against unverified accounts

- **Password Recovery** (US-AUTH-04 - Must)
  - "Forgot Password" functionality
  - Email-based password reset via Supabase
  - Secure credential recovery process

### 2.2 Session Management

- **Session Security** (US-AUTH-05 - Must)

  - Secure session expiration after logout or timeout
  - JWT tokens stored in SecureStore for mobile security
  - Protection on shared devices

- **Terms of Use** (US-AUTH-07 - Must)
  - Mandatory acceptance of latest Terms of Use before app access
  - Legal compliance enforcement

### 2.3 User Profile and Settings

**Client Registration Data** (managed by trainer):

- Full name (required)
- Email (required)
- Age (optional, recommended)
- Location - city and country (optional)
- Timezone (automatic detection via OS)

**Profile Customization**:

- Editable name and avatar in account management
- Custom avatar persistence (overrides social login avatar)
- Timezone-based date and time display coordination

---

## 3. Anamnese (Health Questionnaire)

### 3.1 Mandatory Health Assessment

**Epic Reference**: Epic 4 – Anamnese (Questionnaire)

- **Pre-Workout Requirement** (US-ANA-01 - Must)

  - Mandatory anamnese completion before receiving first workout
  - Enables personalized training program creation
  - Blocks workout access until completed

- **Dynamic Anamnese Models**
  - Default system-provided questionnaire
  - Custom trainer-created questionnaires
  - Trainer-selectable models per client

### 3.2 Sample Anamnese Questions

The app supports comprehensive health assessments with selectable options:

1. **Training Objectives**

   - Weight loss, Hypertrophy, Conditioning, Rehabilitation, Health maintenance

2. **Experience Level**

   - Beginner, Intermediate, Advanced

3. **Current Activity Level**

   - Yes/No current physical activity

4. **Training Frequency Preference**

   - 1x to 5+ times per week

5. **Muscle Group Focus** (up to 3 selections)

   - Chest, Back, Legs, Glutes, Biceps, Triceps, Shoulders, Abs

6. **Injury History and Limitations**

   - Spine, Shoulder, Knee, Ankle, Elbow, Hip issues
   - No injuries/limitations option

7. **Medical Conditions**

   - Hypertension, Diabetes, Heart problems, None, Other

8. **Preferred Training Time**

   - Morning, Afternoon, Evening, Varies by day

9. **Equipment Access**

   - Full gym, Limited gym, Home with weights, Bodyweight only

10. **Mobility/Rehabilitation Willingness**
    - Yes/No for mobility and rehabilitation focus

### 3.3 Anamnese Management

- **Trainer-Initiated Updates** (US-ANA-03 - Should)
  - Trainers can request new anamnese completion anytime
  - Keeps client health data current
  - Triggers new questionnaire flow in mobile app

---

## 4. Workout Execution

### 4.1 Daily Workout Interface

**Epic Reference**: Epic 6 – Workout Execution (Client)

- **Automatic Workout Display** (US-EXE-01 - Must)
  - Today's workout automatically displayed on app opening
  - Clear indication of daily training requirements
  - Smart home screen with contextual states:
    - No workout available: warning message
    - Workout available: session list display
    - Workout completed: progress and options (redo, advance, recover)

### 4.2 Exercise Execution Features

- **Set Completion Tracking** (US-EXE-02 - Must)

  - Mark individual sets as completed
  - Edit load/weight values in real-time
  - Automatic rest timer activation
  - Total workout time tracking (except cardio)

- **Exercise Categories and Sessions**
  - Organized by categories: stretching, strength, cardio, HIIT, mobility
  - Session-based interface navigation
  - Support for multiple exercise types:
    1. Strength/Resistance training
    2. Isometric exercises
    3. Plyometric/HIIT (reps-based)
    4. Steady-state cardio
    5. Interval cardio
    6. Mobility/Flexibility
    7. Compound circuits

### 4.3 Workout Flexibility

- **Manual Workout Completion** (US-EXE-04 - Should)

  - Complete workout even without executing all sets
  - Handles forgotten sets or off-app training
  - Prevents history gaps

- **Exercise Substitution** (US-EXE-05 - Should)
  - Replace exercises with system suggestions
  - Smart filtering by muscle group and equipment
  - Equipment unavailability handling

### 4.4 Workout States and Options

- **Workout Progression Management**
  - Redo completed workouts
  - Advance to future workouts
  - Recovery workout options
  - Rest day management

---

## 5. Offline Support & Synchronization

### 5.1 Offline Capabilities

**Epic Reference**: Epic 9 – Offline Support & Synchronisation

- **Essential Data Caching** (US-OFF-01 - Must)

  - One week of workout data cached locally
  - Training possible without internet connection
  - Critical functionality maintained offline

- **Smart Synchronization** (US-OFF-02 - Should)
  - Exponential back-off retry mechanism
  - Server overload prevention
  - Automatic sync when connection restored

### 5.2 Conflict Resolution

- **Data Merging** (US-OFF-03 - Should)
  - "Last write wins" conflict resolution for MVP
  - Deterministic offline edit merging
  - Data consistency maintenance

---

## 6. Progress Tracking & Media

### 6.1 Progress Visualization

**Epic Reference**: Epic 7 – Progress Tracking & Media

- **Exercise Progress Charts** (US-PRO-01 - Could)

  - Load and rep progression graphs per exercise
  - Visual improvement tracking
  - Historical performance data

- **Progress Photos** (US-PRO-02 - Should)
  - Compressed photo uploads for quick transfer
  - Efficient storage management
  - Visual progress documentation

### 6.2 Workout History

- **Comprehensive History Tracking**
  - Daily workout completion status
  - Exercise-specific progression (load, reps evolution)
  - Best performance records
  - Incomplete workout marking

---

## 7. Communication Features

### 7.1 Trainer-Client Chat

**Epic Reference**: Epic 8 – Chat

- **1:1 Chat Communication** (US-CHAT-01 - Must)

  - Direct communication with assigned trainer
  - Centralized messaging per client
  - Push notifications via Firebase Cloud Messaging (FCM)

- **Exercise-Contextual Messaging** (US-CHAT-02 - Should)
  - Send messages linked to current exercise during workout
  - Trainer receives visual context (exercise icon/name)
  - Enhanced communication relevance

### 7.2 Offline Chat Features

- **Offline Message Handling** (US-CHAT-03 - Should)

  - Message sending status indicators (sending/error)
  - Retry logic for failed messages
  - Offline message queuing

- **Robustness Features** (US-CHAT-04 - Should)
  - Fallback display for removed exercise references
  - Chat readability maintenance
  - Graceful degradation

---

## 8. Internationalization & Localization

### 8.1 Multi-Language Support

**Epic Reference**: Epic 10 – Internationalisation & Units

- **Language Options** (US-I18N-01 - Must)

  - Portuguese (PT-BR) - Primary launch language
  - English (EN-US)
  - Spanish (ES-ES)

- **Fallback System** (US-I18N-02 - Must)

  - PT-BR fallback for missing translations
  - No blank text guarantee

- **Dynamic Language Switching** (US-I18N-03 - Should)
  - In-app language change without restart
  - Real-time interface updates

### 8.2 Unit System Support

- **Measurement Units** (US-I18N-04 - Should)
  - Weight: kg/lb switching
  - Distance: km/mi switching
  - User preference-based display

---

## 9. Media & Animations

### 9.1 Exercise Animations

**Epic Reference**: Epic 11 – Media & Animations

- **Lottie Animation System** (US-MEDIA-01 - Must)

  - Exercise animations served from Supabase Storage
  - Lightweight app design
  - High-quality exercise demonstrations

- **Animation Caching** (US-MEDIA-02 - Should)

  - Weekly animation pre-caching
  - Instant playback performance
  - Offline animation availability

- **Graceful Degradation** (US-MEDIA-03 - Should)
  - Fallback icons when Lottie fails
  - UI robustness maintenance

---

## 10. Legal Compliance

### 10.1 Terms and Privacy

**Epic Reference**: Epic 12 – Legal & Account Closure

- **Legal Document Acceptance** (US-LEGAL-01 - Must)

  - Terms of Use and Privacy Policy acceptance at first login
  - Legal compliance enforcement
  - Mandatory agreement before app access

- **Terms Update Handling** (US-LEGAL-02 - Must)

  - Forced re-acceptance when terms version changes
  - Legal update propagation
  - Version-controlled compliance

- **Document Access** (US-LEGAL-03 - Should)
  - Permanent links to legal documents in account settings
  - Anytime review capability

---

## 11. Performance & Technical Specifications

### 11.1 Non-Functional Requirements

**Epic Reference**: Epic 13 – Non‑Functional (Security, Performance, Quality)

- **Security Features** (US-NFR-02 - Must)

  - JWT tokens stored in SecureStore
  - Secure credential management
  - Data protection compliance

- **Performance Optimization** (US-NFR-04 - Should)

  - Virtualized lists with FlatList
  - Skeleton loaders for smooth UX
  - Large dataset handling

- **Network Optimization** (US-NFR-05 - Should)
  - React Query cache time tuning per entity
  - Optimal network usage
  - Smart data fetching

### 11.2 Technology Stack

- **Framework**: Expo/React Native
- **UI Library**: React Native Paper (Material Community Icons)
- **State Management**: React Query for server state
- **Authentication**: Supabase Auth
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Animations**: Lottie
- **Storage**: SecureStore for sensitive data
- **List Virtualization**: FlatList

---

## 12. Access Control and Trainer Relationship

### 12.1 Trainer Linking

**Epic Reference**: Epic 3 – Client Management

- **Email-Based Invitation** (US-CM-01 - Must)

  - Clients register via trainer email invitation
  - Automatic trainer-client linking
  - Secure relationship establishment

- **Trainer Change Handling** (US-CM-03 - Should)
  - Automatic app updates when trainer changes
  - Seamless workout and chat transitions
  - No data loss during transitions

### 12.2 Account Status Management

- **Client Inactivation Response**

  - Warning display when marked inactive by trainer
  - Loss of workout and chat access
  - Historical data preservation

- **Trainer Plan Restrictions**
  - Continued access when trainer's plan expires
  - Awareness of trainer limitations
  - Service continuity communication

---

## 13. Edge Cases and Special Scenarios

### 13.1 Data Protection Scenarios

- **Row Level Security** (US-NFR-01 - Must)
  - Data isolation by trainer-client relationships
  - Privacy enforcement at database level
  - Secure data access patterns

### 13.2 Common Edge Cases

- **No Anamnese Completion**: Workout access blocked until completion
- **Future Workout Dates**: Unavailable until scheduled date
- **Expired Workouts**: Warning display with options
- **Rest Day Training**: Appropriate messaging and alternatives
- **Equipment Unavailability**: Exercise substitution suggestions
- **Timezone Differences**: Automatic adjustment between trainer and client
  timezones
- **App Reinstallation Offline**: Clear alerts for missing cached data

---

## 14. User Flow Summary

### 14.1 First-Time User Journey

1. **Registration/Login**

   - Email verification required
   - Terms of Use acceptance
   - Social login option available

2. **Anamnese Completion**

   - Mandatory health questionnaire
   - Personalized training preparation
   - Trainer-specific questionnaire possible

3. **Workout Access**
   - Automatic daily workout display
   - Exercise execution interface
   - Progress tracking activation

### 14.2 Daily Usage Flow

1. **App Opening**

   - Today's workout automatic display
   - Status-based home screen adaptation
   - Offline functionality availability

2. **Workout Execution**

   - Session-based exercise navigation
   - Real-time set completion and load editing
   - Rest timer automation

3. **Progress Documentation**
   - Automatic workout completion tracking
   - Optional progress photos
   - Chat communication with trainer

### 14.3 Ongoing Engagement

1. **Progress Monitoring**

   - Historical performance review
   - Exercise progression charts
   - Achievement tracking

2. **Communication**

   - Exercise-contextual trainer messages
   - Push notification receipt
   - Offline message capability

3. **Profile Management**
   - Account settings updates
   - Language and unit preferences
   - Legal document access

---

_This documentation focuses exclusively on the client mobile application
functionality within the Fituno platform MVP._
