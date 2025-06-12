# 📋 Fituno - Complete Project Tasks & Implementation Guide

## Project Summary

This document provides a comprehensive overview and detailed implementation guide for the Fituno fitness application development. The project consists of 25 main tasks covering the complete development lifecycle from infrastructure setup to production launch, with special focus on trainer web application implementation.

## 🏗️ Project Architecture

- **Monorepo Structure**: Yarn Workspaces with shared packages
- **Trainer App**: Next.js 13+ with ShadCN UI (Web)
- **Client App**: Expo React Native with React Native Paper (Mobile)
- **Backend**: Supabase (Database, Auth, Storage, Realtime)
- **Payment**: Stripe integration
- **Languages**: PT-BR, EN, ES support

## 📊 Tasks by Priority

- **High Priority**: 16 tasks (Foundation & Core Features)
- **Medium Priority**: 8 tasks (Quality & Enhancement)
- **Low Priority**: 1 task (Analytics)

---

# 📋 Complete Tasks Overview Table

| ID  | Title                                  | Description                                                                                                       | Priority | Dependencies     | Status  | Key Features                                                   |
| --- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------- | ---------------- | ------- | -------------------------------------------------------------- |
| 1   | Project Infrastructure Setup           | Initialize the monorepo structure with Yarn Workspaces, configure build tools, and set up development environment | High     | None             | Pending | Monorepo setup, TypeScript, CI/CD with GitHub Actions          |
| 2   | Database Schema Implementation         | Create complete Supabase database schema with all tables, relationships, RLS policies, and triggers               | High     | 1                | Pending | 14 main entities, RLS policies, triggers, indexes              |
| 3   | Shared Packages Implementation         | Create all shared packages (types, utils, services, constants) for the monorepo                                   | High     | 1, 2             | Pending | TypeScript interfaces, utils, Supabase client, i18n            |
| 4   | Authentication System                  | Implement complete authentication system with Supabase Auth for both apps                                         | High     | 2, 3             | Pending | Email/password, social login, verification, session management |
| 5   | Trainer Web App Foundation             | Create the Next.js trainer web application with basic structure and routing                                       | High     | 3, 4             | Pending | Next.js 13+, ShadCN UI, routing, auth middleware               |
| 6   | Client Mobile App Foundation           | Create the Expo React Native client application with basic structure and navigation                               | High     | 3, 4             | Pending | Expo, React Native Paper, navigation, offline storage          |
| 7   | Plan & Subscription System             | Implement Stripe integration for trainer subscription management                                                  | High     | 5                | Pending | Free plan (2 clients), PRO upgrade, webhooks                   |
| 8   | Client Management System               | Implement complete client management features for trainers                                                        | High     | 5, 7             | Pending | Client invitation, status management, RLS enforcement          |
| 9   | Anamnesis System                       | Implement anamnesis (questionnaire) system for client assessment                                                  | High     | 6, 8             | Pending | Custom templates, form builder, trainer switching              |
| 10  | Exercise Library & Management          | Create comprehensive exercise library with animations and categorization                                          | High     | 3                | Pending | Exercise data, Lottie animations, search/filtering             |
| 11  | Workout Builder (Trainer)              | Implement drag-and-drop workout builder interface for trainers                                                    | High     | 5, 9, 10         | Pending | Weekly board, exercise drawer, supersets, validation           |
| 12  | Workout Execution (Client)             | Implement workout execution interface for mobile clients                                                          | High     | 6, 10            | Pending | Today's workout, set tracking, offline mode, timers            |
| 13  | Progress Tracking & Media              | Implement progress tracking with photos and measurements                                                          | Medium   | 6, 12            | Pending | Progress graphs, photo uploads, image optimization             |
| 14  | Chat System                            | Implement 1:1 chat between trainers and clients                                                                   | High     | 5, 6             | Pending | Real-time messaging, exercise linking, offline handling        |
| 15  | Offline Support & Synchronization      | Implement comprehensive offline support for mobile client                                                         | High     | 6, 12, 13, 14    | Pending | 1-week caching, sync retries, conflict resolution              |
| 16  | Internationalization & Units           | Implement multi-language support and unit system                                                                  | High     | 3, 5, 6          | Pending | PT-BR/EN/ES, dynamic switching, metric/imperial                |
| 17  | Media & Animation System               | Implement Lottie animation system for exercises                                                                   | Medium   | 6, 10, 15        | Pending | Supabase Storage, pre-caching, fallback handling               |
| 18  | Legal & Compliance                     | Implement Terms of Use and Privacy Policy acceptance system                                                       | High     | 4                | Pending | Terms acceptance, version control, permanent access            |
| 19  | Security & Performance Optimization    | Implement security measures and performance optimizations                                                         | High     | 2, 4, 5, 6       | Pending | RLS policies, secure storage, virtualized lists                |
| 20  | Testing Infrastructure                 | Set up comprehensive testing suite for both applications                                                          | Medium   | 5, 6             | Pending | Jest, Playwright, Detox, CI/CD, 70% coverage                   |
| 21  | Data Migration & Seeding               | Create data migration scripts and seed data for development and testing                                           | Medium   | 2, 10            | Pending | Migration scripts, exercise library, seed data                 |
| 22  | Edge Case Handling                     | Implement handling for identified edge cases and error scenarios                                                  | Medium   | 4, 8, 14, 15, 17 | Pending | Avatar persistence, chat fallbacks, error boundaries           |
| 23  | Performance Monitoring & Analytics     | Implement monitoring, logging, and analytics systems                                                              | Low      | 5, 6             | Pending | Error monitoring, performance metrics, dashboards              |
| 24  | Documentation & Deployment             | Create comprehensive documentation and set up deployment pipelines                                                | Medium   | 19, 20           | Pending | Dev docs, API docs, deployment, secrets management             |
| 25  | Final Integration & Launch Preparation | Complete final integration testing and prepare for production launch                                              | High     | 18, 22, 23, 24   | Pending | Integration testing, load testing, app store submission        |

---

# 🔄 Dependency Flow Analysis

## Phase 1: Foundation (Tasks 1-6)

1. **Project Infrastructure Setup** (1) → No dependencies
2. **Database Schema Implementation** (2) → Depends on: 1
3. **Shared Packages Implementation** (3) → Depends on: 1, 2
4. **Authentication System** (4) → Depends on: 2, 3
5. **Trainer Web App Foundation** (5) → Depends on: 3, 4
6. **Client Mobile App Foundation** (6) → Depends on: 3, 4

## Phase 2: Core Features (Tasks 7-18)

- **Subscription & Client Management** (7, 8) → Build on trainer foundation
- **Content Systems** (9, 10) → Anamnesis and exercise library
- **Main Features** (11, 12) → Workout builder and execution
- **Supporting Features** (13-18) → Progress, chat, offline, i18n, legal

## Phase 3: Quality & Launch (Tasks 19-25)

- **Optimization** (19-21) → Security, testing, data management
- **Finalization** (22-25) → Edge cases, monitoring, docs, launch

---

# 🏋️‍♂️ DETAILED TRAINER APP TASK BREAKDOWN

This section provides comprehensive implementation details for trainer-specific tasks following the dev_workflow methodology.

---

## Task 5: Trainer Web App Foundation

### 5.1 Next.js Project Setup

- **Description**: Initialize Next.js 13+ project with TypeScript and essential configurations
- **Implementation**:
  - Create project with `create-next-app@latest` using TypeScript template
  - Configure `next.config.js` for API routes and image optimization
  - Set up TypeScript strict mode in `tsconfig.json`
  - Configure ESLint with custom rules for Next.js and React
- **Dependencies**: Task 1 (Project Infrastructure)
- **Test Strategy**: Verify project builds without errors, TypeScript compilation passes, linting rules work

### 5.2 ShadCN UI Integration

- **Description**: Set up ShadCN UI component library with custom theming
- **Implementation**:
  - Install and configure ShadCN CLI
  - Initialize components with `npx shadcn-ui@latest init`
  - Add core components: Button, Card, Input, Dialog, Sheet, Table
  - Create custom theme variables in `globals.css`
  - Set up fitness-focused color palette (primary blues, secondary greens)
- **Dependencies**: Task 5.1
- **Test Strategy**: Verify components render correctly, theming applies properly, dark/light mode works

### 5.3 App Router Configuration

- **Description**: Implement Next.js 13+ App Router with proper layout structure
- **Implementation**:
  - Create `app/layout.tsx` with global providers
  - Set up route groups: `(auth)`, `(dashboard)`, `(settings)`
  - Configure page layouts for different sections
  - Implement loading and error boundaries
  - Set up metadata API for SEO
- **Dependencies**: Task 5.2
- **Test Strategy**: Test routing between pages, verify layouts render, check loading states

### 5.4 Authentication Middleware

- **Description**: Implement auth protection middleware using Supabase
- **Implementation**:
  - Create `middleware.ts` for route protection
  - Configure protected and public routes
  - Handle session validation and refresh
  - Implement role-based access (trainer-only routes)
  - Set up redirect logic for authenticated/unauthenticated users
- **Dependencies**: Task 4 (Authentication System)
- **Test Strategy**: Test protected route access, verify redirects work, check session persistence

### 5.5 Global State Setup

- **Description**: Configure state management with React Query and Zustand
- **Implementation**:
  - Set up React Query client with Supabase integration
  - Configure query client with proper caching strategies
  - Create Zustand stores for UI state (theme, sidebar, modals)
  - Implement auth context provider
  - Set up error boundaries for query errors
- **Dependencies**: Task 5.3
- **Test Strategy**: Verify state persists correctly, test query caching, check error handling

---

## Task 7: Plan & Subscription System

### 7.1 Stripe Integration Setup

- **Description**: Configure Stripe for subscription management
- **Implementation**:
  - Install Stripe SDK and configure environment variables
  - Create Stripe customer on trainer registration
  - Set up subscription products (Free, PRO) in Stripe dashboard
  - Implement price lookup and display logic
  - Configure webhook endpoints for subscription events
- **Dependencies**: Task 5 (Trainer Web App Foundation)
- **Test Strategy**: Test Stripe connection, verify webhook reception, check customer creation

### 7.2 Subscription Status Management

- **Description**: Track and enforce subscription limits
- **Implementation**:
  - Create subscription status checker middleware
  - Implement client count validation
  - Display subscription status in dashboard
  - Create upgrade prompts and banners
  - Handle expired subscription state
- **Dependencies**: Task 7.1
- **Test Strategy**: Test client limit enforcement, verify subscription status updates, check upgrade prompts

### 7.3 Checkout Flow Implementation

- **Description**: Build Stripe checkout integration
- **Implementation**:
  - Create checkout session API endpoint
  - Implement embedded checkout component
  - Handle successful payment redirects
  - Process subscription updates via webhooks
  - Create billing history display
- **Dependencies**: Task 7.2
- **Test Strategy**: Complete test purchases, verify webhook processing, check billing history

### 7.4 Plan Restriction Logic

- **Description**: Implement feature restrictions based on subscription
- **Implementation**:
  - Create feature flag system based on subscription
  - Block PRO features for free users
  - Implement progressive disclosure for upgrades
  - Add billing management interface
  - Handle plan downgrade scenarios
- **Dependencies**: Task 7.3
- **Test Strategy**: Test feature restrictions, verify upgrade flows, check downgrade handling

---

## Task 8: Client Management System

### 8.1 Client Invitation System

- **Description**: Implement client invitation via email
- **Implementation**:
  - Create invitation form with email validation
  - Generate secure invitation tokens
  - Send invitation emails via Supabase Auth
  - Track invitation status (sent, pending, accepted)
  - Handle invitation expiration
- **Dependencies**: Task 5 (Trainer Web App Foundation)
- **Test Strategy**: Send test invitations, verify email delivery, check token validation

### 8.2 Client List Interface

- **Description**: Build comprehensive client management dashboard
- **Implementation**:
  - Create responsive client grid/list view
  - Implement status-based filtering and sorting
  - Add search functionality by name/email
  - Display client metrics (last active, progress)
  - Create quick action buttons (message, view, manage)
- **Dependencies**: Task 8.1
- **Test Strategy**: Test filtering and search, verify data display, check responsive design

### 8.3 Client Detail Views

- **Description**: Detailed client profile and management pages
- **Implementation**:
  - Create comprehensive client profile page
  - Display anamnesis summary with key insights
  - Show current workout plan and progress
  - Integrate chat interface for communication
  - Add progress photo gallery and metrics
- **Dependencies**: Task 8.2
- **Test Strategy**: Verify data accuracy, test navigation, check real-time updates

### 8.4 Client Status Management

- **Description**: Handle client lifecycle and status changes
- **Implementation**:
  - Implement status change logic (active/inactive)
  - Handle trainer switching scenarios
  - Manage client data visibility based on RLS
  - Create client transfer workflow
  - Implement soft delete with data retention
- **Dependencies**: Task 8.3
- **Test Strategy**: Test status transitions, verify RLS enforcement, check data integrity

---

## Task 9: Anamnesis System

### 9.1 Template Builder Interface

- **Description**: Drag-and-drop anamnesis template builder
- **Implementation**:
  - Create question type library (text, choice, scale, number)
  - Implement drag-and-drop form builder
  - Add conditional logic for dynamic questions
  - Create template preview functionality
  - Implement template versioning and duplication
- **Dependencies**: Task 8 (Client Management System)
- **Test Strategy**: Build test templates, verify conditional logic, check template saving

### 9.2 Question Management System

- **Description**: Comprehensive question editor and management
- **Implementation**:
  - Create rich text editor for question content
  - Implement validation rules for different question types
  - Add media upload for question context (images/videos)
  - Create question categorization and tagging
  - Implement question bank for reuse
- **Dependencies**: Task 9.1
- **Test Strategy**: Create various question types, test validation, verify media uploads

### 9.3 Template Assignment Workflow

- **Description**: Assign and track anamnesis completion
- **Implementation**:
  - Create template selection interface for clients
  - Implement assignment notification system
  - Track completion status and progress
  - Create reminder system for incomplete anamnesis
  - Handle template updates and re-assignments
- **Dependencies**: Task 9.2
- **Test Strategy**: Test assignment flow, verify notifications, check completion tracking

### 9.4 Response Analysis Dashboard

- **Description**: Analyze and visualize client responses
- **Implementation**:
  - Create response summary visualization
  - Implement health risk identification algorithms
  - Generate automated insights and recommendations
  - Create comparative analysis between clients
  - Export response data in various formats
- **Dependencies**: Task 9.3
- **Test Strategy**: Analyze test responses, verify insights accuracy, check export functionality

---

## Task 11: Workout Builder (Trainer)

### 11.1 Weekly Planning Board

- **Description**: Drag-and-drop weekly workout planning interface
- **Implementation**:
  - Create 7-day grid layout with responsive design
  - Implement drag-and-drop with `@dnd-kit/core`
  - Add day-specific configuration (rest, active recovery)
  - Create workout session templates
  - Implement undo/redo functionality
- **Dependencies**: Task 10 (Exercise Library), Task 9 (Anamnesis System)
- **Test Strategy**: Test drag-and-drop functionality, verify layout responsiveness, check template creation

### 11.2 Exercise Selection Drawer

- **Description**: Searchable and filterable exercise library interface
- **Implementation**:
  - Create slide-out drawer with exercise library
  - Implement fuzzy search with exercise names and descriptions
  - Add multi-level filtering (muscle group, equipment, type)
  - Create exercise preview with animation playback
  - Implement favorites and recent exercises
- **Dependencies**: Task 11.1
- **Test Strategy**: Test search functionality, verify filtering accuracy, check animation playback

### 11.3 Exercise Parameter Forms

- **Description**: Dynamic forms for exercise-specific parameters
- **Implementation**:
  - Create type-specific form components for each exercise type
  - Implement form validation with Zod schemas
  - Add unit conversion (kg/lb, km/mi) support
  - Create parameter templates for quick setup
  - Implement batch editing for multiple exercises
- **Dependencies**: Task 11.2
- **Test Strategy**: Test form validation, verify unit conversions, check parameter saving

### 11.4 Superset and Circuit Builder

- **Description**: Advanced workout structure creation
- **Implementation**:
  - Create grouping interface for supersets/circuits
  - Implement nested drag-and-drop for exercise ordering
  - Add timing and rest period management
  - Create circuit round configuration
  - Implement execution order visualization
- **Dependencies**: Task 11.3
- **Test Strategy**: Create test supersets/circuits, verify execution order, check timing calculations

### 11.5 Workout Validation and Publishing

- **Description**: Validate and publish workout plans
- **Implementation**:
  - Create comprehensive workout validation rules
  - Implement conflict detection (equipment, time)
  - Add workout preview for client view
  - Create publishing workflow with versioning
  - Implement rollback functionality for published plans
- **Dependencies**: Task 11.4
- **Test Strategy**: Test validation rules, verify publishing flow, check version management

### 11.6 Anamnesis Context Integration

- **Description**: Display relevant client information during workout creation
- **Implementation**:
  - Create sticky context panel with client data
  - Display health restrictions and goals
  - Highlight exercise contraindications
  - Show previous workout history and preferences
  - Implement smart exercise recommendations
- **Dependencies**: Task 11.5
- **Test Strategy**: Verify context accuracy, test recommendation engine, check contraindication alerts

---

## Task 14: Chat System

### 14.1 Real-time Chat Interface

- **Description**: Live messaging system between trainer and clients
- **Implementation**:
  - Set up Supabase Realtime subscriptions
  - Create chat window with message threading
  - Implement typing indicators and read receipts
  - Add message status indicators (sending, sent, read)
  - Create unread message badges and notifications
- **Dependencies**: Task 5 (Trainer Web App Foundation)
- **Test Strategy**: Test real-time messaging, verify status indicators, check notification delivery

### 14.2 Exercise Context Linking

- **Description**: Link chat messages to specific exercises
- **Implementation**:
  - Create exercise selection modal for message context
  - Display exercise details in linked messages
  - Implement exercise reference cards in chat
  - Add quick exercise substitution from chat
  - Handle exercise deletion gracefully in chat history
- **Dependencies**: Task 14.1
- **Test Strategy**: Test exercise linking, verify context display, check fallback handling

### 14.3 Quick Response System

- **Description**: Pre-written responses and message templates
- **Implementation**:
  - Create library of common trainer responses
  - Implement message templates with variables
  - Add emoji and reaction support
  - Create motivational message automation
  - Implement response categorization
- **Dependencies**: Task 14.2
- **Test Strategy**: Test template usage, verify variable substitution, check automation triggers

### 14.4 Media Sharing Capabilities

- **Description**: Share images, videos, and documents in chat
- **Implementation**:
  - Implement file upload with Supabase Storage
  - Add image compression and optimization
  - Create video preview and playback
  - Implement file type validation and size limits
  - Add media gallery view in chat
- **Dependencies**: Task 14.3
- **Test Strategy**: Test file uploads, verify compression, check media playbook

---

## Task 13: Progress Tracking & Media

### 13.1 Progress Visualization Dashboard

- **Description**: Charts and graphs for client progress tracking
- **Implementation**:
  - Integrate Recharts for data visualization
  - Create load progression charts per exercise
  - Implement volume tracking graphs (weekly/monthly)
  - Add body weight and measurement tracking
  - Create comparative progress views
- **Dependencies**: Task 8 (Client Management)
- **Test Strategy**: Test chart rendering, verify data accuracy, check responsive design

### 13.2 Progress Photo Management

- **Description**: Client progress photo handling and comparison
- **Implementation**:
  - Create photo upload interface with compression
  - Implement before/after comparison views
  - Add photo annotation and measurement tools
  - Create timeline view for progress photos
  - Implement photo sharing and privacy controls
- **Dependencies**: Task 13.1
- **Test Strategy**: Test photo uploads, verify compression, check comparison functionality

### 13.3 Achievement and Milestone System

- **Description**: Track and celebrate client achievements
- **Implementation**:
  - Create milestone definition system
  - Implement automatic achievement detection
  - Add celebration animations and notifications
  - Create achievement badge system
  - Implement progress streak tracking
- **Dependencies**: Task 13.2
- **Test Strategy**: Test milestone detection, verify achievement triggers, check notification delivery

---

# 📱 DETAILED CLIENT MOBILE APP TASK BREAKDOWN

This section provides comprehensive implementation details for client mobile app tasks following the dev_workflow methodology.

---

## Task 6: Client Mobile App Foundation

### 6.1 Expo Project Setup

- **Description**: Initialize Expo React Native project with TypeScript and essential configurations
- **Implementation**:
  - Create project with `npx create-expo-app@latest` using TypeScript template
  - Configure `app.json` for app metadata and build settings
  - Set up TypeScript strict mode in `tsconfig.json`
  - Configure ESLint with React Native and Expo rules
  - Install and configure Expo development build
- **Dependencies**: Task 1 (Project Infrastructure)
- **Test Strategy**: Verify project builds on iOS/Android, TypeScript compilation passes, development server runs

### 6.2 React Native Paper Integration

- **Description**: Set up React Native Paper UI library with custom theming
- **Implementation**:
  - Install React Native Paper and required dependencies
  - Configure Material Design 3 theme with fitness-focused colors
  - Set up custom theme provider with light/dark mode support
  - Add core components: Button, Card, TextInput, FAB, Appbar
  - Configure typography and spacing tokens
- **Dependencies**: Task 6.1
- **Test Strategy**: Verify components render correctly, theming applies properly, theme switching works

### 6.3 Navigation Setup

- **Description**: Implement React Navigation with proper screen structure
- **Implementation**:
  - Install React Navigation 6 with native dependencies
  - Create navigation structure: Stack, Tab, and Drawer navigators
  - Set up screen groups: Auth, Main (Tabs), Settings
  - Configure deep linking for workout sharing
  - Implement navigation state persistence
- **Dependencies**: Task 6.2
- **Test Strategy**: Test navigation between screens, verify deep links, check state persistence

### 6.4 Offline Storage Configuration

- **Description**: Set up local storage for offline functionality
- **Implementation**:
  - Configure Expo SQLite for structured data storage
  - Set up AsyncStorage for simple key-value pairs
  - Implement Expo SecureStore for sensitive data (tokens)
  - Create database schema for offline workout data
  - Set up data migration system for schema updates
- **Dependencies**: Task 6.3
- **Test Strategy**: Test data persistence, verify encryption, check migration scripts

### 6.5 Authentication Integration

- **Description**: Integrate Supabase Auth with secure token management
- **Implementation**:
  - Set up Supabase client with React Native configuration
  - Implement secure token storage with Expo SecureStore
  - Create auth context provider with session management
  - Handle authentication state changes and redirects
  - Implement biometric authentication (fingerprint/face)
- **Dependencies**: Task 4 (Authentication System), Task 6.4
- **Test Strategy**: Test login/logout flows, verify token security, check biometric auth

---

## Task 9: Anamnesis System (Client Side)

### 9.1 Anamnesis Form Renderer

- **Description**: Dynamic form renderer for anamnesis questionnaires
- **Implementation**:
  - Create dynamic form components for all question types
  - Implement form validation with real-time feedback
  - Add progress indicator for multi-step forms
  - Create auto-save functionality for partial responses
  - Handle conditional question logic and branching
- **Dependencies**: Task 6 (Client Mobile App Foundation)
- **Test Strategy**: Test all question types, verify validation, check auto-save functionality

### 9.2 Response Management

- **Description**: Handle anamnesis response submission and tracking
- **Implementation**:
  - Create response submission with offline support
  - Implement draft saving and restoration
  - Add response review and edit functionality
  - Handle form expiration and re-submission requests
  - Create response history tracking
- **Dependencies**: Task 9.1
- **Test Strategy**: Test offline submission, verify draft functionality, check response tracking

### 9.3 Onboarding Integration

- **Description**: Integrate anamnesis into client onboarding flow
- **Implementation**:
  - Create onboarding wizard with anamnesis step
  - Implement skip/complete later functionality
  - Add progress tracking across onboarding steps
  - Create reminder notifications for incomplete anamnesis
  - Handle trainer assignment during onboarding
- **Dependencies**: Task 9.2
- **Test Strategy**: Test complete onboarding flow, verify reminders, check trainer assignment

---

## Task 12: Workout Execution (Client)

### 12.1 Today's Workout Interface

- **Description**: Main workout execution screen with exercise display
- **Implementation**:
  - Create workout overview with exercise list
  - Implement exercise card with animation preview
  - Add workout progress indicator and timer
  - Create rest timer with customizable intervals
  - Implement workout pause/resume functionality
- **Dependencies**: Task 6 (Client Mobile App Foundation), Task 10 (Exercise Library)
- **Test Strategy**: Test workout flow, verify timers, check pause/resume functionality

### 12.2 Exercise Execution Tracking

- **Description**: Individual exercise tracking with set/rep logging
- **Implementation**:
  - Create exercise detail screen with parameter inputs
  - Implement set completion tracking with visual feedback
  - Add weight/rep adjustment with quick increment buttons
  - Create exercise substitution interface
  - Handle different exercise types (strength, cardio, isometric)
- **Dependencies**: Task 12.1
- **Test Strategy**: Test all exercise types, verify data logging, check substitution flow

### 12.3 Workout Session Management

- **Description**: Complete workout session handling and completion
- **Implementation**:
  - Create workout start/finish flow with confirmation
  - Implement session summary with performance metrics
  - Add workout rating and feedback system
  - Create incomplete workout handling and resumption
  - Handle workout scheduling and rescheduling
- **Dependencies**: Task 12.2
- **Test Strategy**: Test complete sessions, verify metrics, check resumption functionality

### 12.4 Offline Workout Support

- **Description**: Full offline workout execution with sync
- **Implementation**:
  - Cache workout data for offline access (1 week ahead)
  - Implement offline exercise logging with local storage
  - Create sync queue for completed workouts
  - Handle conflict resolution for offline/online data
  - Add offline indicator and sync status display
- **Dependencies**: Task 12.3, Task 15 (Offline Support)
- **Test Strategy**: Test offline execution, verify sync functionality, check conflict resolution

---

## Task 15: Offline Support & Synchronization

### 15.1 Data Caching Strategy

- **Description**: Implement intelligent data caching for offline use
- **Implementation**:
  - Create workout data pre-caching (current + 1 week ahead)
  - Implement exercise library caching with animations
  - Add user profile and settings caching
  - Create cache invalidation and refresh logic
  - Handle storage quota management and cleanup
- **Dependencies**: Task 6 (Client Mobile App Foundation)
- **Test Strategy**: Test cache efficiency, verify storage limits, check refresh logic

### 15.2 Sync Queue Management

- **Description**: Manage offline actions and synchronization
- **Implementation**:
  - Create action queue for offline operations
  - Implement retry logic with exponential backoff
  - Add conflict detection and resolution strategies
  - Create sync status indicators and progress tracking
  - Handle partial sync failures and recovery
- **Dependencies**: Task 15.1
- **Test Strategy**: Test sync reliability, verify conflict resolution, check failure recovery

### 15.3 Network State Handling

- **Description**: Detect and respond to network connectivity changes
- **Implementation**:
  - Implement network state monitoring with NetInfo
  - Create automatic sync triggers on connectivity restore
  - Add manual sync controls and force refresh
  - Handle background sync with app state changes
  - Create network error handling and user feedback
- **Dependencies**: Task 15.2
- **Test Strategy**: Test connectivity changes, verify background sync, check error handling

---

## Task 17: Media & Animation System (Client)

### 17.1 Lottie Animation Integration

- **Description**: Implement exercise animations with Lottie
- **Implementation**:
  - Set up Lottie React Native with Expo compatibility
  - Create animation caching system for offline use
  - Implement animation controls (play, pause, loop)
  - Add fallback handling for failed animation loads
  - Create animation preloading for smooth playback
- **Dependencies**: Task 6 (Client Mobile App Foundation), Task 10 (Exercise Library)
- **Test Strategy**: Test animation playback, verify caching, check fallback handling

### 17.2 Exercise Media Management

- **Description**: Handle exercise images, videos, and animations
- **Implementation**:
  - Create media download and caching system
  - Implement progressive loading for large media files
  - Add media compression for storage optimization
  - Create media gallery for exercise references
  - Handle media updates and version management
- **Dependencies**: Task 17.1
- **Test Strategy**: Test media loading, verify compression, check version updates

### 17.3 Progress Photo Capture

- **Description**: Camera integration for progress photos
- **Implementation**:
  - Set up Expo Camera with permission handling
  - Create photo capture interface with guidelines
  - Implement image compression and optimization
  - Add photo annotation and measurement tools
  - Create before/after comparison views
- **Dependencies**: Task 17.2
- **Test Strategy**: Test camera functionality, verify compression, check comparison tools

---

## Task 14: Chat System (Client Side)

### 14.1 Chat Interface Implementation

- **Description**: Mobile chat interface with trainer communication
- **Implementation**:
  - Create chat screen with message list and input
  - Implement real-time messaging with Supabase Realtime
  - Add message status indicators and read receipts
  - Create typing indicators and online status
  - Handle message pagination and infinite scroll
- **Dependencies**: Task 6 (Client Mobile App Foundation)
- **Test Strategy**: Test real-time messaging, verify status indicators, check pagination

### 14.2 Exercise Context Integration

- **Description**: Link chat messages to workout exercises
- **Implementation**:
  - Create exercise reference cards in chat
  - Implement quick exercise sharing from workout
  - Add exercise substitution requests via chat
  - Handle exercise context in message threads
  - Create exercise-specific chat shortcuts
- **Dependencies**: Task 14.1, Task 12 (Workout Execution)
- **Test Strategy**: Test exercise linking, verify context display, check shortcuts

### 14.3 Media Sharing in Chat

- **Description**: Share photos, videos, and progress updates
- **Implementation**:
  - Implement photo/video sharing with compression
  - Create progress photo sharing with annotations
  - Add voice message recording and playback
  - Handle file upload with progress indicators
  - Create media gallery view in chat
- **Dependencies**: Task 14.2, Task 17 (Media & Animation System)
- **Test Strategy**: Test media sharing, verify compression, check voice messages

### 14.4 Push Notifications

- **Description**: Real-time notifications for messages and updates
- **Implementation**:
  - Set up Expo Notifications with proper permissions
  - Create notification categories (messages, workouts, reminders)
  - Implement notification scheduling and management
  - Add notification action buttons (reply, view)
  - Handle notification deep linking to specific screens
- **Dependencies**: Task 14.3
- **Test Strategy**: Test notification delivery, verify deep linking, check action buttons

---

## Task 13: Progress Tracking & Media (Client Side)

### 13.1 Progress Dashboard

- **Description**: Visual progress tracking and metrics display
- **Implementation**:
  - Create progress overview with key metrics
  - Implement workout streak and consistency tracking
  - Add weight progression charts with Recharts
  - Create achievement badges and milestone display
  - Handle different measurement units (kg/lb, cm/in)
- **Dependencies**: Task 6 (Client Mobile App Foundation), Task 12 (Workout Execution)
- **Test Strategy**: Test chart rendering, verify calculations, check unit conversions

### 13.2 Body Measurements Tracking

- **Description**: Track body measurements and progress photos
- **Implementation**:
  - Create measurement input forms with validation
  - Implement measurement history and trend analysis
  - Add body part measurement templates
  - Create measurement reminders and scheduling
  - Handle measurement unit preferences
- **Dependencies**: Task 13.1
- **Test Strategy**: Test measurement tracking, verify trends, check reminders

### 13.3 Achievement System

- **Description**: Gamification with achievements and rewards
- **Implementation**:
  - Create achievement definition and tracking system
  - Implement milestone celebrations with animations
  - Add streak tracking and consistency rewards
  - Create personal records (PR) detection and display
  - Handle achievement notifications and sharing
- **Dependencies**: Task 13.2
- **Test Strategy**: Test achievement detection, verify celebrations, check PR tracking

---

## Task 16: Internationalization & Units (Client Side)

### 16.1 Multi-language Support

- **Description**: Complete internationalization for mobile app
- **Implementation**:
  - Set up react-i18next with Expo Localization
  - Create translation files for PT-BR, EN, ES
  - Implement dynamic language switching
  - Add RTL support for future expansion
  - Handle date/time formatting per locale
- **Dependencies**: Task 6 (Client Mobile App Foundation)
- **Test Strategy**: Test language switching, verify translations, check date formatting

### 16.2 Unit System Management

- **Description**: Handle metric/imperial unit conversions
- **Implementation**:
  - Create unit conversion utilities (kg/lb, km/mi, cm/in)
  - Implement user preference storage and sync
  - Add unit display throughout the app
  - Create unit conversion in workout logging
  - Handle mixed unit scenarios gracefully
- **Dependencies**: Task 16.1
- **Test Strategy**: Test unit conversions, verify preferences, check mixed scenarios

---

## Task 18: Legal & Compliance (Client Side)

### 18.1 Terms and Privacy Implementation

- **Description**: Legal document acceptance and management
- **Implementation**:
  - Create terms and privacy policy display screens
  - Implement mandatory acceptance flow on first launch
  - Add version tracking and re-acceptance handling
  - Create permanent access to legal documents
  - Handle terms updates with forced re-acceptance
- **Dependencies**: Task 6 (Client Mobile App Foundation)
- **Test Strategy**: Test acceptance flow, verify version tracking, check re-acceptance

### 18.2 Data Privacy Controls

- **Description**: User data privacy and control features
- **Implementation**:
  - Create data export functionality
  - Implement data deletion requests
  - Add privacy settings and controls
  - Create data sharing preferences
  - Handle GDPR compliance features
- **Dependencies**: Task 18.1
- **Test Strategy**: Test data export, verify deletion, check privacy controls

---

# 📋 Implementation Checklist

## ✅ Getting Started

- [ ] Task 1: Set up monorepo with Yarn Workspaces
- [ ] Task 2: Create Supabase database schema
- [ ] Task 3: Implement shared packages

## 🔐 Authentication & Security

- [ ] Task 4: Supabase Auth integration
- [ ] Task 18: Terms & Privacy compliance
- [ ] Task 19: Security optimizations

## 💻 Applications

- [ ] Task 5: Next.js trainer web app (Detailed above)
- [ ] Task 6: Expo React Native client app (Detailed above)

## 💳 Business Logic

- [ ] Task 7: Stripe subscription system (Detailed above)
- [ ] Task 8: Client management features (Detailed above)
- [ ] Task 9: Anamnesis questionnaire system (Detailed above - Trainer & Client)

## 🏋️ Core Features

- [ ] Task 10: Exercise library with animations
- [ ] Task 11: Workout builder (trainer) (Detailed above)
- [ ] Task 12: Workout execution (client) (Detailed above)
- [ ] Task 14: Real-time chat system (Detailed above - Trainer & Client)

## 📱 Mobile Features

- [ ] Task 15: Offline support & sync (Detailed above)
- [ ] Task 17: Lottie animation system (Detailed above)

## 🌐 Internationalization

- [ ] Task 16: Multi-language support (PT-BR, EN, ES) (Detailed above)

## 📈 Analytics & Media

- [ ] Task 13: Progress tracking & photos (Detailed above - Trainer & Client)
- [ ] Task 23: Performance monitoring

## 🧪 Quality Assurance

- [ ] Task 20: Testing infrastructure
- [ ] Task 21: Data migration & seeding
- [ ] Task 22: Edge case handling

## 🚀 Launch Preparation

- [ ] Task 18: Legal & compliance (Detailed above)
- [ ] Task 24: Documentation & deployment
- [ ] Task 25: Final integration & launch

---

# 🗓️ Implementation Timeline

## Week 1-2: Foundation Setup

**Trainer App:**

- [ ] Task 5.1-5.3: Next.js setup and routing
- [ ] Task 5.4-5.5: Authentication and state management

**Client App:**

- [ ] Task 6.1-6.3: Expo setup and navigation
- [ ] Task 6.4-6.5: Offline storage and authentication

## Week 3-4: Subscription & Core Setup

**Trainer App:**

- [ ] Task 7.1-7.2: Stripe integration and status management
- [ ] Task 7.3-7.4: Checkout flow and restrictions

**Client App:**

- [ ] Task 18.1-18.2: Legal compliance and privacy controls
- [ ] Task 16.1-16.2: Internationalization and unit system

## Week 5-6: Client Management & Anamnesis

**Trainer App:**

- [ ] Task 8.1-8.2: Invitation system and client list
- [ ] Task 8.3-8.4: Client details and status management

**Client App:**

- [ ] Task 9.1-9.2: Anamnesis form renderer and response management
- [ ] Task 9.3: Onboarding integration

## Week 7-8: Anamnesis & Workout Foundation

**Trainer App:**

- [ ] Task 9.1-9.2: Template builder and question management
- [ ] Task 9.3-9.4: Assignment workflow and analysis

**Client App:**

- [ ] Task 12.1-12.2: Today's workout interface and exercise tracking
- [ ] Task 15.1: Data caching strategy

## Week 9-11: Workout Systems

**Trainer App:**

- [ ] Task 11.1-11.3: Planning board and exercise selection
- [ ] Task 11.4-11.6: Advanced features and context integration

**Client App:**

- [ ] Task 12.3-12.4: Workout session management and offline support
- [ ] Task 15.2-15.3: Sync queue and network state handling

## Week 12-13: Communication & Media

**Both Apps:**

- [ ] Task 14.1-14.2: Real-time chat and exercise context
- [ ] Task 14.3-14.4: Media sharing and notifications (Client)

**Client App:**

- [ ] Task 17.1-17.3: Lottie animations and media management
- [ ] Task 13.1-13.2: Progress dashboard and measurements

## Week 14-16: Progress & Final Polish

**Trainer App:**

- [ ] Task 13.1-13.3: Progress tracking and achievements

**Client App:**

- [ ] Task 13.3: Achievement system completion

**Both Apps:**

- [ ] Integration testing across all features
- [ ] Performance optimization and bug fixes
- [ ] User acceptance testing and deployment preparation

---

## 📝 Notes

- **User Stories Coverage**: All tasks map to specific user stories (US-AUTH-01, US-PLAN-01, etc.)
- **Edge Cases**: Task 22 specifically handles edge cases EC-01 through EC-05
- **MVP Focus**: High priority tasks cover MVP requirements
- **Architecture Compliance**: All tasks follow the architecture defined in project documentation
- **Dependency Management**: Tasks are structured to allow parallel development where possible
- **Trainer Focus**: Detailed subtasks provided for trainer-specific features (Tasks 5, 7-9, 11, 13-14)
- **Client Focus**: Detailed subtasks provided for client mobile app features (Tasks 6, 9, 12-18)
- **Cross-Platform**: Tasks 13, 14, 16, 18 include both trainer and client implementations

---

_This comprehensive guide serves as the complete implementation roadmap for the Fituno project, ensuring all features align with user needs and technical requirements. The detailed trainer app sections provide granular implementation guidance following dev_workflow methodology._
