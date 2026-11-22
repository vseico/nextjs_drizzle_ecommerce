# Grocery Cart

A full-stack grocery store built with Next.js (App Router), Drizzle ORM + Neon Postgres,
Better Auth (email/password + Google), Cloudinary (product images) and Stripe (payments).

## Features

- Product catalogue with filters, sorting, search and product pages
- Cart stored in the database (per user), synced across tabs/devices
- Checkout with saved delivery addresses
- Payment by **card (Stripe Checkout)** or **Cash on Delivery**
- Customer "My Orders" page with payment / delivery status and "Pay now" for unpaid card orders
- Admin dashboard (`/admin`): products, orders (with an **Awaiting shipment** queue), order status updates, customers, stats
- Login with email/password (show/hide password) or **Google**
