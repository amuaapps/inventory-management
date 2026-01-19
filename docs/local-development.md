# Local Development Guide

This guide provides detailed instructions for setting up and running the donation product inventory system locally.

## Quick Start

For the fastest setup, run:

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB (Docker Compose)
npm run dev:setup

# 3. In a new terminal, start the Payload server
npm run dev
```

Visit `http://localhost:3000/admin` to access the Payload Admin UI.

## Prerequisites

- **Node.js** >= 18.0.0
- **Docker** and **Docker Compose** (for local MongoDB)
- **npm** or **yarn**

## Detailed Setup

### 1. Clone and Install

```bash
git clone https://github.com/amuaapps/inventory-management.git
cd inventory-management
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
SERVER_URL=http://localhost:3000

# MongoDB connection (default for Docker Compose)
MONGODB_URI=mongodb://localhost:27017/donation-inventory

# Generate a secure random string (min 32 characters)
PAYLOAD_SECRET=your-secret-key-here-min-32-chars

# API key for /api/v1 endpoints
SYSTEM_API_KEY=your-system-api-key-here
```

**Generating secure secrets:**

```bash
# macOS/Linux
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Start MongoDB

#### Option A: Docker Compose (Recommended)

Use the provided helper script:

```bash
./scripts/start-dev.sh
```

Or manually:

```bash
docker-compose up -d
```

Check MongoDB health:

```bash
docker-compose ps
docker-compose logs mongodb
```

#### Option B: Local MongoDB Installation

**macOS:**
```bash
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
mongosh --eval "db.version()"
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Option C: Cloud MongoDB

Use MongoDB Atlas or Azure Cosmos DB (MongoDB API). Update `MONGODB_URI` in `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/donation-inventory?retryWrites=true&w=majority
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will start with hot-reload enabled. Any changes to TypeScript files will automatically restart the server.

**Expected output:**
```
[nodemon] starting `ts-node src/server.ts`
[Payload] Initializing...
[Payload] Admin URL: http://localhost:3000/admin
Server listening on port 3000
```

### 5. Access the Admin UI

Open your browser and navigate to:

```
http://localhost:3000/admin
```

On first visit, you'll be prompted to create an admin user account.

## Development Workflow

### Daily Workflow

```bash
# Start MongoDB (if not already running)
npm run dev:setup

# Start the Payload server
npm run dev

# Make changes to code (auto-reloads)

# Run tests
npm run test:unit

# Check code quality
npm run lint
npm run typecheck
```

### Stopping Services

```bash
# Stop Payload server
# Press Ctrl+C in the terminal

# Stop MongoDB
npm run dev:stop
```

### Resetting the Database

To start fresh with a clean database:

```bash
# Stop everything
npm run dev:stop

# Remove MongoDB data volumes
docker-compose down -v

# Start again
npm run dev:setup
npm run dev
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# With coverage report
npm run test:coverage
```

### Watch Mode

```bash
npm test -- --watch
```

## Code Quality Checks

Before committing code, run:

```bash
# Lint check
npm run lint

# Type check
npm run typecheck

# Format check
npm run format

# Fix issues automatically
npm run lint:fix
npm run format:fix
```

## Building for Production

```bash
# Build TypeScript to JavaScript
npm run build

# Run production build
npm run serve
```

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoServerError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
```bash
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=3001
```

### TypeScript Compilation Errors

**Solution:**
```bash
# Clean build artifacts
rm -rf dist/

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run type check
npm run typecheck
```

### Docker Issues

**Error:** `Cannot connect to the Docker daemon`

**Solution:**
- Ensure Docker Desktop is running
- Check Docker daemon status: `docker info`

**Error:** `docker-compose: command not found`

**Solution:**
```bash
# Install Docker Compose
# macOS: Included with Docker Desktop
# Linux:
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `3000` | Server port |
| `SERVER_URL` | No | `http://localhost:3000` | Public server URL |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `PAYLOAD_SECRET` | Yes | - | Payload encryption key (min 32 chars) |
| `SYSTEM_API_KEY` | Yes | - | API key for `/api/v1` endpoints |

## Next Steps

- [Architecture Documentation](architecture.md)
- [API Documentation](../README.md#api-documentation)
- [Deployment Guide](../README.md#deployment)

## Getting Help

- Check the [main README](../README.md)
- Review [Payload CMS documentation](https://payloadcms.com/docs)
- Open an issue on GitHub
