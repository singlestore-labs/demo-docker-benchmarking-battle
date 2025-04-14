# Schemas

## Overview

This document provides an overview of the database schema used in the project. The schema is designed to support a platform that manages users, organizations, campaigns, roulettes, prizes, participants, spins, and subscription management.

## Tables

### Users (`users`)

Stores user information.

- `id`: Unique identifier
- `email`: User email (unique)
- `firstName`, `lastName`: User name fields
- `image`: Profile picture
- `createdAt`, `updatedAt`: Timestamps

### Organizations (`organizations`)

Stores organization data.

- `id`: Unique identifier
- `slug`: Unique slug for the organization
- `name`: Organization name
- `createdAt`, `updatedAt`: Timestamps

### Organization Users (`organization_users`)

Associates users with organizations.

- `id`: Unique identifier
- `organizationId`: Reference to `organizations`
- `userId`: Reference to `users`
- `role`: User role in the organization (`owner`, `admin`, `member`)
- `createdAt`, `updatedAt`: Timestamps

### Campaigns (`campaigns`)

Manages marketing campaigns.

- `id`: Unique identifier
- `organizationId`: Reference to `organizations`
- `userId`: Reference to `users`
- `status`: (`draft`, `active`, `canceled`, `ended`, `archived`)
- `slug`, `name`, `description`: Campaign details
- `startAt`, `endAt`: Campaign duration
- `createdAt`, `updatedAt`, `deletedAt`, `archivedAt`: Timestamps

### Roulettes (`roulettes`)

Manages individual roulettes in campaigns.

- `id`: Unique identifier
- `campaignId`: Reference to `campaigns`
- `userId`: Reference to `users`
- `status`: (`draft`, `active`, `canceled`, `ended`, `archived`)
- `slug`, `name`, `description`: Roulette details
- `maxParticipants`, `maxSpinsPerParticipant`: Constraints
- `startAt`, `endAt`: Availability
- `createdAt`, `updatedAt`, `deletedAt`, `archivedAt`: Timestamps

### Prizes (`prizes`)

Stores prizes available in roulettes.

- `id`: Unique identifier
- `rouletteId`: Reference to `roulettes`
- `type`: (`physical`, `digital`, `coupon`, `other`)
- `status`: (`draft`, `active`, `out_of_stock`, `expired`, `canceled`, `archived`)
- `name`, `description`, `image`: Prize details
- `quantity`: Stock quantity
- `probability`: Winning probability
- `maxWinsPerParticipant`: Win limit per user
- `isHidden`: Boolean for UI visibility
- `expiresAt`: Expiration timestamp
- `createdAt`, `updatedAt`, `deletedAt`, `archivedAt`: Timestamps

### Participants (`participants`)

Tracks participants in roulettes.

- `id`: Unique identifier
- `userId`: Reference to `users`
- `rouletteId`: Reference to `roulettes`
- `status`: (`active`, `banned`, `disqualified`)
- `ipAddress`, `deviceInfo`, `location`, `referrer`: User tracking data
- `createdAt`, `updatedAt`: Timestamps

### Spins (`spins`)

Tracks each spin attempt by participants.

- `id`: Unique identifier
- `participantId`: Reference to `participants`
- `rouletteId`: Reference to `roulettes`
- `prizeId`: Reference to `prizes` (nullable if no win)
- `sequenceNumber`: Order of spin
- `createdAt`, `updatedAt`: Timestamps

### Subscription Plans (`subscription_plans`)

Stores available subscription options.

- `id`: Unique identifier
- `name`: Plan name
- `price`: Cost of the plan
- `billingPeriod`: (`monthly`, `yearly`)
- `trialDays`: Trial period duration
- `createdAt`, `updatedAt`: Timestamps

### Subscriptions (`subscriptions`)

Tracks user subscriptions.

- `id`: Unique identifier
- `userId`: Reference to `users`
- `subscriptionPlanId`: Reference to `subscription_plans`
- `status`: (`active`, `canceled`, `ended`)
- `isAutoRenewal`: Boolean for auto-renewal
- `renewalCount`: Number of renewals
- `startedAt`, `expiresAt`, `canceledAt`: Timestamps
- `metadata`: JSON field for additional data
- `createdAt`, `updatedAt`: Timestamps

### Subscription Payments (`subscription_payments`)

Tracks payments for subscriptions.

- `id`: Unique identifier
- `subscriptionId`: Reference to `subscriptions`
- `amount`: Payment amount
- `currency`: Payment currency
- `status`: (`pending`, `successful`, `failed`)
- `paidAt`: Timestamp of successful payment
- `createdAt`, `updatedAt`: Timestamps

## Notes

- Common fields like `id`, `createdAt`, `updatedAt`, `deletedAt`, and `archivedAt` are used across tables for consistency.
- `metadata` fields are included in some tables for extensibility.
- `slug` is used where unique identifiers are needed for SEO-friendly URLs.
- Enum fields ensure consistency in statuses across tables.

For database migrations and setup, refer to the project documentation on running migrations.
