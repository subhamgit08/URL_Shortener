# Snap Shortener - Scalable URL Shortener

<p align="center">
  <img src="" alt="Snap Shortener project screenshot" width="900" />
</p>

Snap Shortener is a full-stack URL shortening platform built with React, Node.js, Express, MongoDB, Redis, Clerk authentication, Socket.IO, BullMQ, Mailjet, and Razorpay. The project is designed around a common system-design problem: converting long, hard-to-share URLs into short, reliable, trackable links that can handle high read traffic.

## Problem Statement

Long URLs are difficult to share, remember, print, and use in marketing campaigns. They often contain tracking parameters, random identifiers, and deeply nested paths that make them visually noisy and error-prone. A URL shortener solves this by mapping a long URL to a compact code, such as `abc123`, and redirecting users from the short link to the original destination.

The challenge is not only creating a short code. A production-style URL shortener must also solve problems around uniqueness, fast redirects, high read traffic, analytics, user ownership, paid usage tiers, and operational communication with users.

This project approaches the problem as a scalable link-management system rather than a single CRUD API.

## Initial Problems

The project starts from several practical problems:

- Long links are inconvenient for users to share across social media, SMS, emails, and printed material.
- Randomly generating short codes can create collisions, especially as the number of links grows.
- Redirect traffic is read-heavy, so querying the database on every click can become slow and expensive.
- Click analytics are valuable, but writing every click directly to MongoDB creates unnecessary write pressure.
- Users need secure accounts so their links and subscription plans can be managed separately.
- The platform needs pricing tiers for free, pro, and premium usage.
- Admins need a way to broadcast updates to users in real time.
- Contact and notification flows should not block the main user experience.

## How The Project Solves These Problems

### Short Code Generation

The backend uses an atomic MongoDB counter to generate an increasing sequence number. That number is converted into a compact Base62 string using digits, lowercase letters, and uppercase letters.

This solves two important problems:

- It avoids random-code collisions.
- It keeps generated URLs short and readable as the system grows.

Relevant files:

- `backend/config/Counter.js`
- `backend/utils/Base62Converter.js`
- `backend/controllers/urlControllers.js`

### Authenticated URL Creation

URL creation is protected with Clerk authentication. The backend extracts the authenticated `userId` using Clerk middleware and stores each generated URL against that user.

This makes the system user-aware and allows future features such as dashboards, per-user analytics, limits, and subscription-based quotas.

### Duplicate URL Handling

Before creating a new short URL, the backend checks whether the same user has already shortened the same long URL. If it exists, the existing short URL is returned instead of creating a duplicate.

This avoids unnecessary database records and gives users a consistent result for the same input.

### Fast Redirects With Redis Caching

Redirects are the most frequent operation in a URL shortener. To keep redirects fast, the backend first checks Redis for the long URL using the short code as a cache key.

Flow:

1. User opens a short URL.
2. Backend increments click count in Redis.
3. Backend checks Redis for `url:<shortCode>`.
4. On cache hit, it redirects immediately.
5. On cache miss, it loads the URL from MongoDB, stores it in Redis, and redirects.

This reduces database load and improves response time for popular links.

### Batched Click Analytics

Instead of updating MongoDB on every redirect, clicks are accumulated in Redis using a hash called `url_clicks`. A scheduled sync runs every 5 minutes and bulk updates MongoDB with all accumulated click counts.

This design solves the write-scaling problem:

- Redis handles frequent increments efficiently.
- MongoDB receives fewer, larger `bulkWrite` operations.
- Redirect latency stays low because analytics writes are not performed synchronously.

Relevant file:

- `backend/controllers/clickSyncer.js`

### User Plans And Payments

The project includes free, pro, and premium plans in the frontend pricing page. Razorpay is used for payment order creation and payment verification. After a successful payment, the user's plan is updated in MongoDB.

The backend verifies Razorpay signatures using HMAC before upgrading a user, which protects the subscription flow from fake payment confirmations.

Relevant files:

- `frontend/src/components/Pricing.jsx`
- `backend/routes/payment_routes.js`
- `backend/models/user.js`

### Real-Time Notifications

The system uses Socket.IO for browser-based real-time updates. Users can subscribe to notification rooms, while admins can publish messages through an admin dashboard.

Redis Pub/Sub is used to publish admin notifications, and Socket.IO forwards those messages to connected users.

Relevant files:

- `backend/server.js`
- `backend/routes/admin_routes.js`
- `backend/config/socket.js`
- `frontend/src/components/AdminDashboard.jsx`
- `frontend/src/components/NotificationCenter.jsx`

### Background Jobs

BullMQ is configured with Redis for background processing. The project uses queues for notification and background tasks such as sending subscription confirmation emails and handling feedback-related email workflows.

This keeps slow or external-service-dependent work away from the main request-response path.

Relevant files:

- `backend/config/queue.js`
- `backend/config/notificationWorker.js`
- `backend/config/workerQueue.js`

### Frontend Experience

The React frontend provides:

- A landing page explaining the product.
- An authenticated URL-shortening page.
- A generated short-link result with copy-to-clipboard support.
- A pricing page with Razorpay checkout.
- A contact/feedback page.
- An admin broadcast dashboard.
- Animated UI using Framer Motion, Tailwind CSS, MUI, and visual background components.

## System Design And Scaling Highlights

### Read Scalability

URL redirects are optimized with Redis caching. Since read traffic is usually much higher than write traffic in a URL shortener, caching the short-code-to-long-URL mapping is one of the most important scaling choices in the project.

### Write Scalability

Click tracking is separated from the redirect response. Redis absorbs frequent click increments, and MongoDB is updated later in batches. This protects MongoDB from high write volume during traffic spikes.

### Unique ID Scalability

The atomic counter plus Base62 encoding gives deterministic, unique short codes without collision checks across randomly generated strings.

### Async Scalability

Email and notification work is pushed to queues where possible. This allows the API to respond quickly while workers handle slower tasks in the background.

### Real-Time Communication

Socket.IO and Redis Pub/Sub allow the project to support live announcements. This pattern can be scaled further by running multiple backend instances that all listen to Redis channels.

### Data Separation

The project separates key data models:

- URL data is stored in `Shortened_urls`.
- User and subscription data is stored in `User`.
- Temporary cache and counters are handled by Redis.
- Background jobs are handled by BullMQ queues.

This separation makes the system easier to extend without mixing unrelated responsibilities.

## Key Features

- Secure user authentication with Clerk.
- Short URL creation using Base62 encoding.
- Collision-free code generation using an atomic counter.
- Redis cache for low-latency redirects.
- Batched click analytics synced to MongoDB.
- MongoDB persistence for users, links, plans, and click counts.
- Razorpay integration for paid plans.
- Webhook support for Clerk user creation and deletion.
- Socket.IO-based real-time notifications.
- Redis Pub/Sub for admin broadcasts.
- BullMQ workers for background email and notification tasks.
- React frontend with animated pages and copy-to-clipboard UX.

## Current Architecture

```text
React Frontend
     |
     | HTTP requests with Clerk auth
     v
Express Backend
     |
     |---- MongoDB: users, URLs, subscriptions, click totals
     |
     |---- Redis: URL cache, click aggregation, Pub/Sub
     |
     |---- BullMQ: background jobs
     |
     |---- Razorpay: payments
     |
     |---- Clerk: authentication and user webhooks
     |
     |---- Socket.IO: real-time browser notifications
```

## Future Enhancements

- Add custom aliases so users can choose branded short codes.
- Add rate limiting based on plan limits, such as 10, 30, or 50 URLs per minute.
- Add a user dashboard to list, search, edit, delete, and monitor shortened URLs.
- Add detailed analytics such as referrer, device, browser, country, and time-series click graphs.
- Add QR code generation for every short URL.
- Add link expiration dates and password-protected links.
- Add abuse detection for spam, malware, phishing, and suspicious redirect destinations.
- Add database indexes for faster lookup on `shortCode`, `userId`, and common dashboard queries.
- Add API keys so premium users can create short URLs from external applications.
- Add retry, dead-letter, and monitoring support for BullMQ jobs.
- Add automated tests for URL creation, redirect behavior, payment verification, and webhook handling.
- Add Docker Compose for local MongoDB, Redis, backend, frontend, and workers.
- Add deployment documentation for frontend, backend, Redis, MongoDB, workers, and environment variables.
- Add cache invalidation support when URLs are edited or deleted.
- Add horizontal scaling support with multiple backend instances behind a load balancer.

## Conclusion

Snap Shortener demonstrates how a simple product idea can be expanded into a system-design-oriented full-stack application. The core feature is URL shortening, but the project also addresses real engineering concerns such as fast redirects, unique ID generation, caching, batched analytics, authentication, payments, background processing, and real-time notifications.

The result is a strong foundation for a scalable link-management platform that can continue evolving into a more complete SaaS product.
