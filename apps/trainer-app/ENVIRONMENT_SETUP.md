# Environment Setup for Trainer App

## Required Environment Variables

Create a `.env.local` file in the `apps/trainer-app` directory with the
following environment variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Stripe Product IDs (created in Stripe Dashboard)
STRIPE_BASIC_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_ENTERPRISE_PRICE_ID=

# Application URLs
NEXT_PUBLIC_APP_URL=
NEXTAUTH_URL=

# Database
DATABASE_URL=

# NextAuth Configuration
NEXTAUTH_SECRET=

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Supabase (if using instead of direct database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email Service (for notifications)
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=

# Optional: Redis for caching/sessions
REDIS_URL=

# Development/Production Environment
NODE_ENV=development
```

## Setup Instructions

1. Copy the environment variables above into a new `.env.local` file:

   ```bash
   cd apps/trainer-app
   touch .env.local
   ```

2. Fill in the required values:

   - Get Stripe keys from your Stripe Dashboard
   - Create Stripe products and copy the price IDs
   - Set your application URL (e.g., `http://localhost:3000`)
   - Configure database connection string
   - Generate a secure NextAuth secret

3. For Stripe webhook setup:

   - Install Stripe CLI:
     `stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

4. Required Stripe webhook events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Stripe Dashboard Setup

1. Create three products in Stripe Dashboard:

   - **Basic Plan**: $19.99/month, 3 clients limit
   - **Pro Plan**: $49.99/month, unlimited clients
   - **Enterprise Plan**: $99.99/month, unlimited clients + advanced features

2. Copy the price IDs for each plan to the corresponding environment variables.

3. Set up webhook endpoint pointing to `/api/v1/webhooks/stripe`
