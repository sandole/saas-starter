# John's Plant Pots - Ecommerce Shop

A streamlined ecommerce application for selling premium plant pots, built with Next.js, PostgreSQL, and Stripe payments.

![John's Plant Pots](https://via.placeholder.com/800x400.png?text=John's+Plant+Pots)

## Features

### 🔐 User Authentication
- Email/password signup and login
- Session-based authentication
- Protected checkout routes

### 🪴 Product Catalog
- Featured premium plant pots
- Product cards with images and descriptions
- Simple, intuitive product browsing

### 🛒 Shopping Cart
- Add items to cart with quantity selection
- Update or remove items
- Works for both logged-in and guest users (localStorage fallback)
- Persistent cart between sessions for logged-in users

### 💳 Checkout Process
- Seamless Stripe payment integration
- Order confirmation
- Order history for logged-in users

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI**: Custom components with [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: Custom JWT-based auth with [jose](https://github.com/panva/jose)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database
- Stripe account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/johns-plant-pots.git
   cd johns-plant-pots
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up your environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```
   
4. Fill in the required environment variables in `.env`:
   ```
   POSTGRES_URL=postgresql://username:password@localhost:5432/db_name
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   BASE_URL=http://localhost:3000
   AUTH_SECRET=random_string_here
   ```

### Development

Use the included setup script to create your `.env` file if you haven't done so manually:

```bash
npm run db:setup
# or
pnpm db:setup
```

Then, run the database migrations and seed the database with default products:

```bash
npm run db:migrate
npm run db:seed
# or
pnpm db:migrate
pnpm db:seed
```

This will create a test user with:
- Email: `test@example.com`
- Password: `password123`

Start the development server:

```bash
npm run dev
# or
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Testing Payments

To test Stripe payments, use these test card details:

- Card Number: `4242 4242 4242 4242`
- Expiration: Any future date
- CVC: Any 3-digit number

Optionally, you can listen for Stripe webhooks locally through their CLI to handle payment events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Deployment

### Production Setup

When deploying to production, follow these steps:

1. Set up a production Stripe webhook
   - Go to the Stripe Dashboard and create a new webhook for your production environment
   - Set the endpoint URL to your production API route (e.g., `https://yourdomain.com/api/stripe/webhook`)
   - Select the events you want to listen for (e.g., `checkout.session.completed`)

2. Add environment variables to your hosting platform
   - `BASE_URL`: Set this to your production domain
   - `STRIPE_SECRET_KEY`: Use your Stripe secret key for the production environment
   - `STRIPE_WEBHOOK_SECRET`: Use the webhook secret from the production webhook
   - `POSTGRES_URL`: Set this to your production database URL
   - `AUTH_SECRET`: Generate a random string using `openssl rand -base64 32`

3. Deploy your application
   - If using Vercel, connect your repository and follow their deployment process
   - Make sure to add all the necessary environment variables in your project settings

## Project Structure

```
.
├── app                     # Next.js App Router
│   ├── (login)             # Auth-related pages
│   ├── api                 # API routes
│   ├── cart                # Shopping cart page
│   ├── checkout            # Checkout and success pages
│   └── page.tsx            # Home page
├── components              # React components
│   ├── ui                  # UI components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── LoginForm.tsx
│   ├── ProductCard.tsx
│   └── ShoppingCart.tsx
├── lib                     # Utility functions
│   ├── auth                # Authentication logic
│   ├── db                  # Database setup and queries
│   └── payments            # Payment processing
└── public                  # Static assets
    └── images              # Product images
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.