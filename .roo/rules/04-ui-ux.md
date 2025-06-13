---
description:
globs:
alwaysApply: false
---

# UI/UX Standards and Best Practices

## Component Libraries

1. **Web (Trainer App)**

   - Use shadcn/ui as primary component library
   - Follow Tailwind CSS conventions
   - Maintain consistent spacing and sizing
   - Use provided color tokens

2. **Mobile (Client App)**
   - Use React Native Paper components
   - Follow Material Design guidelines
   - Consistent touch targets and spacing
   - Use native platform patterns

## Design System

1. **Colors**

   - Primary Blue: #2b85ff
   - Success Green: #11b683
   - Warning Yellow: #dfb725
   - Error Red: #e34b51
   - Use semantic color naming in code

2. **Typography**
   - Use consistent font hierarchy
   - Follow platform-specific text sizes
   - Maintain readable contrast ratios
   - Support dynamic font scaling

## Loading States

1. **Skeleton Loading**

   - Use skeleton loaders for content
   - Implement loading boundaries
   - Show loading states for async actions
   - Maintain layout stability

2. **Progress Indicators**
   - Clear progress for long operations
   - Use appropriate loading animations
   - Show upload/download progress
   - Implement cancel options where appropriate

## Error States

1. **Error Handling**

   - Show clear error messages
   - Provide recovery actions
   - Implement error boundaries
   - Handle offline states gracefully

2. **Empty States**
   - Show helpful empty state messages
   - Provide clear next actions
   - Use appropriate illustrations
   - Maintain consistent styling

## Responsive Design

1. **Web Responsiveness**

   - Support all screen sizes
   - Use fluid typography
   - Implement proper breakpoints
   - Test across devices

2. **Mobile Adaptation**
   - Support both portrait and landscape
   - Handle notches and safe areas
   - Support tablet layouts
   - Test on various devices

## Accessibility

1. **General Guidelines**

   - Proper ARIA labels
   - Keyboard navigation support
   - Screen reader compatibility
   - Sufficient color contrast

2. **Mobile Specific**
   - Support dynamic text sizing
   - Voice Over/TalkBack support
   - Adequate touch targets
   - Clear focus indicators

## Internationalization

1. **Text Handling**

   - Use i18n for all text
   - Support RTL languages
   - Handle dynamic text length
   - Use proper date/number formatting

2. **Layout Considerations**
   - Flexible layouts for translations
   - Handle long text gracefully
   - Support different character sets
   - Maintain proper text alignment

## Performance

1. **Optimization**

   - Implement virtualized lists
   - Lazy load components
   - Optimize images and animations
   - Monitor render performance

2. **Animation**
   - Use native animations when possible
   - Implement smooth transitions
   - Handle animation failures
   - Consider reduced motion settings
