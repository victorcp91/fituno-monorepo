---
description:
globs:
alwaysApply: false
---

# Analytics and Tracking Implementation Rules

## Event Tracking Structure

1. **Core Events**

   ```typescript
   type CoreEventCategory =
     | 'workout' // Eventos relacionados a treinos
     | 'exercise' // Eventos de exercícios específicos
     | 'subscription' // Eventos de assinatura
     | 'user' // Eventos de usuário
     | 'trainer' // Eventos de personal
     | 'chat'; // Eventos de comunicação
   ```

2. **Event Properties**
   - Timestamp obrigatório
   - User ID anônimo
   - Session ID
   - Platform info
   - Version info

## Implementation Guidelines

1. **Web Analytics**

   - Google Analytics 4
   - PostHog para product analytics
   - Hotjar para heatmaps
   - Custom event tracking

2. **Mobile Analytics**
   - Firebase Analytics
   - Mixpanel integration
   - Crash reporting
   - Performance monitoring

## User Journey Tracking

1. **Onboarding Flow**

   - Sign up steps
   - Profile completion
   - Initial assessment
   - First workout creation

2. **Engagement Metrics**
   - Workout completion rate
   - Exercise modifications
   - Chat response time
   - Feature usage patterns

## Performance Metrics

1. **App Performance**

   - Load times
   - API response times
   - Animation performance
   - Memory usage

2. **User Experience**
   - Error rates
   - Drop-off points
   - Success metrics
   - User satisfaction

## Privacy Compliance

1. **Data Collection**

   - LGPD compliance
   - GDPR compliance
   - Data anonymization
   - Retention policies

2. **User Consent**
   - Clear opt-in/out
   - Cookie consent
   - Privacy settings
   - Data access requests

## Business Analytics

1. **KPI Tracking**

   - Customer acquisition
   - Retention rates
   - Revenue metrics
   - Churn analysis

2. **Growth Metrics**
   - Viral coefficient
   - NPS tracking
   - User satisfaction
   - Feature adoption

## Implementation Rules

1. **Event Naming**

   - Use snake_case
   - Clear descriptive names
   - Consistent categorization
   - Version tracking

2. **Data Quality**
   - Validate event data
   - Handle offline events
   - Prevent duplicates
   - Monitor data integrity
