---
description:
globs:
alwaysApply: false
---

# Project Structure and Organization

## Monorepo Structure

The project follows a monorepo structure with Yarn Workspaces. All code must be
organized according to:

- [apps/](mdc:apps) - Contains the main applications
  - [apps/client-app/](mdc:apps/client-app) - React Native mobile app for
    clients
  - [apps/trainer-app/](mdc:apps/trainer-app) - Next.js web app for trainers
- [packages/](mdc:packages) - Shared packages and utilities
  - [packages/types/](mdc:packages/types) - Shared TypeScript types and Zod
    schemas
  - [packages/utils/](mdc:packages/utils) - Shared utility functions
  - [packages/services/](mdc:packages/services) - Shared service integrations
  - [packages/constants/](mdc:packages/constants) - Shared constants and
    configurations

## Key Rules

1. **Shared Code Location**

   - All shared types MUST be in `packages/types`
   - All shared utilities MUST be in `packages/utils`
   - All shared services MUST be in `packages/services`
   - All shared constants MUST be in `packages/constants`

2. **Import Conventions**

   - Use TypeScript path aliases for imports
   - Example: `import { WorkoutPlan } from "@fituno/types"`

3. **Component Organization**

   - Web components MUST use shadcn/ui
   - Mobile components MUST use React Native Paper
   - Custom components MUST be in their respective app's components directory

4. **Feature Organization**

   - Features MUST be organized by domain in `features/` directory
   - Example: `features/workout/`, `features/chat/`,
     `features/client-management/`

5. **Configuration Files**
   - Environment variables MUST be in `.env` files
   - TypeScript config MUST be in `tsconfig.json`
   - Package management MUST use `yarn` and `package.json`

## Naming Conventions

1. Files and Directories:

   - Use kebab-case for directories: `client-management/`
   - Use PascalCase for React components: `WorkoutBuilder.tsx`
   - Use camelCase for utilities: `formatDate.ts`

2. Components:

   - Suffix with type: `WorkoutCard.tsx`, `ChatButton.tsx`
   - HOCs prefix with 'with': `withAuth.tsx`
   - Hooks prefix with 'use': `useWorkout.ts`

3. Types and Interfaces:
   - Prefix interfaces with 'I': `IWorkout`
   - Suffix types with 'Type': `WorkoutType`
   - Use PascalCase: `WorkoutPlan`, `ExerciseSet`
