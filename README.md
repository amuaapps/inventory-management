# Donation Product Inventory

A lightweight inventory management system for donation products using **Payload CMS 3.71.1** with MongoDB.

Built with MACH principles: Microservices, API-first, Cloud-native, Headless.

## Features

- **Admin UI** (Payload Admin) for managing product inventory
- **Stable REST APIs** (`/api/v1/...`) for system integration
- **Currency precision** with integer cents storage
- **Atomic donation increments** to prevent race conditions
- **Blue/green deployment** on Azure Container Apps

## Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or remote)
- npm or yarn

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the required variables:

```env
NODE_ENV=development
PORT=3000
SERVER_URL=http://localhost:3000

# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/donation-inventory

# Payload secret (min 32 characters)
PAYLOAD_SECRET=your-secret-key-here-min-32-chars

# System API key for /api/v1 endpoints
SYSTEM_API_KEY=your-system-api-key-here
```

**Important:** Generate secure random values for `PAYLOAD_SECRET` and `SYSTEM_API_KEY` in production.

### 3. Start Local MongoDB

See [Prompt 02 instructions](docs/architecture.md) for MongoDB setup options:

**Option A: Docker Compose** (recommended, coming in next prompt)

**Option B: Local MongoDB installation**

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or use a cloud MongoDB service (MongoDB Atlas, Azure Cosmos DB)
```

### 4. Run the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

Access the Payload Admin UI at: `http://localhost:3000/admin`

### 5. Create First Admin User

On first run, visit `/admin` and create your admin account through the Payload UI.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run serve` - Run production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Check code formatting
- `npm run format:fix` - Fix code formatting
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:coverage` - Run tests with coverage report

## Project Structure

```
.
├── src/
│   ├── app/              # HTTP handlers / API endpoints
│   ├── domain/           # Domain models, business logic
│   ├── infra/            # Adapters (DB, external APIs)
│   ├── config/           # Configuration loading
│   ├── utils/            # Shared utilities
│   ├── payload.config.ts # Payload CMS configuration
│   └── server.ts         # Express server entry point
├── tests/
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── infra/
│   ├── azure/            # Azure Bicep templates
│   └── aws/              # AWS Terraform (future)
├── docs/                 # Architecture documentation
└── scripts/              # Utility scripts
```

## Architecture

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

## API Documentation

### Admin UI

- **URL:** `http://localhost:3000/admin`
- **Authentication:** Email/password (Payload built-in auth)

### System APIs

All `/api/v1/...` endpoints require the `X-System-Api-Key` header.

**Coming in Prompt 04:** Full API endpoint documentation.

## Deployment

### Azure (v1)

Deployment to Azure Container Apps with Cosmos DB (MongoDB API).

**Coming in Prompts 10-11:** Full Azure deployment instructions.

### AWS (Future)

AWS infrastructure will be added in a future release.

## Testing

Run tests before committing:

```bash
npm run lint
npm run typecheck
npm run test
```

## Contributing

1. Follow TypeScript strict mode guidelines
2. Write tests for new features
3. Run linting and formatting before committing
4. Follow the coding standards in `agents.md`

## License

MIT
