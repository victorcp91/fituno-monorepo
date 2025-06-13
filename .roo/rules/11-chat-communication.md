---
description:
globs:
alwaysApply: false
---

# Chat and Communication Features Rules

## Message Types

1. **Core Message Types**

   ```typescript
   type MessageType =
     | 'text' // Mensagem de texto
     | 'image' // Imagem
     | 'workout_share' // Compartilhamento de treino
     | 'progress_share' // Compartilhamento de progresso
     | 'system' // Mensagem do sistema
     | 'quick_reply'; // Resposta rápida
   ```

2. **Message Properties**
   - Timestamp
   - Read status
   - Delivery status
   - Reply reference
   - Media attachments

## Real-time Implementation

1. **Supabase Realtime**

   - Channel management
   - Presence features
   - Typing indicators
   - Online status

2. **Offline Support**
   - Message queueing
   - Local storage
   - Sync mechanism
   - Conflict resolution

## UI/UX Guidelines

1. **Chat Interface**

   - Message grouping
   - Time indicators
   - Status indicators
   - Input controls

2. **Media Handling**
   - Image compression
   - Upload progress
   - Preview generation
   - Cache management

## Notifications

1. **Push Notifications**

   - New message alerts
   - Mention notifications
   - Silent notifications
   - Grouping strategy

2. **In-app Notifications**
   - Unread indicators
   - Sound alerts
   - Badge counting
   - Mute options

## Security

1. **Message Security**

   - End-to-end encryption
   - Media encryption
   - Access control
   - Message retention

2. **User Privacy**
   - Online status control
   - Read receipt control
   - Block functionality
   - Report system

## Performance

1. **Message Loading**

   - Pagination
   - Lazy loading
   - Cache strategy
   - Prefetching

2. **Media Optimization**
   - Image resizing
   - Progressive loading
   - Bandwidth management
   - Storage optimization

## Business Rules

1. **Chat Access**

   - Free plan limits
   - Pro plan features
   - Group chat rules
   - Archive policy

2. **Support Features**
   - Quick replies
   - Templates
   - Auto-responses
   - Chat analytics

## Integration

1. **Workout Integration**

   - Share workouts
   - Progress updates
   - Exercise demos
   - Feedback system

2. **External Sharing**
   - Export chat logs
   - Share progress
   - External links
   - Deep linking
