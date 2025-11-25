# Parking Slot Reservation System

A complete, local-only Parking Slot Reservation System built with Node.js, Express, MongoDB, and React.

## Features
- **User**: Sign up, View Slots, Book Parking, Pay (Stripe Test), View History.
- **Admin**: Manage Slots, View Analytics.
- **System**: Concurrency Control, Background Workers (No-Show, Overstay).
- **Local-Only**: Runs entirely on your machine without Docker or Cloud dependencies.

## Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local Community Edition or Atlas)
- **Redis** (Optional - for advanced locking/queues)

## Quick Start (Local)

### 1. Clone and Setup
```bash
# Clone the repository (if using git)
# git clone <repo-url>
cd "Parking Slot Reservation System"
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env to set your MONGO_URI (default is localhost)

# Seed Database (Create Admin & Slots)
npm run dev   # Starts server on port 5001
```
*Backend runs on http://localhost:5001*

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start Client
npm run dev
```
*Frontend runs on http://localhost:5173*

## Configuration (.env)
- `USE_REDIS=true/false`: Enable/Disable Redis.
- `USE_STRIPE=true/false`: Enable/Disable Stripe payments.
- `MONGO_URI`: Connection string for MongoDB.

## Documentation
- **SRS**: [docs/SRS.md](docs/SRS.md)
- **API Docs**: [openapi.yaml](openapi.yaml)
- **Diagrams**: [docs/diagrams/](docs/diagrams/)

## Testing
- **Backend Unit Tests**: `cd backend && npm test`
- **Frontend E2E Tests**: `cd frontend && npx playwright test`
