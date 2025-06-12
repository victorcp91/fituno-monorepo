# Fituno

Monorepo for the Fituno fitness training platform, containing both the trainer web app and client mobile app.

## 🚀 Getting Started

1. Install dependencies:

```bash
yarn install
```

2. Build all packages:

```bash
yarn workspaces run build
```

3. Start the trainer web app:

```bash
yarn dev:trainer
```

4. Start the client mobile app:

```bash
yarn dev:client
```

## 📦 Workspace Structure

- `apps/trainer-app`: Web application for trainers (Next.js)
- `apps/client-app`: Mobile application for clients (Expo/React Native)
- `packages/ui`: Shared UI components and design system
- `packages/types`: Shared TypeScript types
- `packages/utils`: Shared utilities and helpers
- `packages/services`: Shared service integrations (Supabase, Stripe, etc.)
- `packages/constants`: Shared constants and configurations

## 🛠️ Development

- All shared code should be placed in the appropriate package under `packages/`
- Use the shared UI components from `@fituno/ui` when possible
- Follow the TypeScript types defined in `@fituno/types`
- Reuse utilities from `@fituno/utils`
- Configure services using `@fituno/services`

## 📚 Documentation

For detailed documentation about the project structure and conventions, see [docs/monorepo.md](docs/monorepo.md).

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests for a specific workspace
yarn workspace @fituno/trainer-app test
```

## 🔍 Linting

```bash
# Lint all workspaces
yarn lint

# Lint a specific workspace
yarn workspace @fituno/client-app lint
```
