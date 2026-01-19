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

**Note:** Payload CMS 3.x is built on Next.js, not Express. This project uses Next.js 15 with the Payload Next.js adapter.

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

**Option A: Docker Compose** (recommended)

Use the provided script to start MongoDB in a Docker container:

```bash
./scripts/start-dev.sh
```

This will:
- Start MongoDB 7.0 in a Docker container
- Create persistent volumes for data
- Wait for MongoDB to be healthy
- Display the connection string

To stop MongoDB:

```bash
./scripts/stop-dev.sh
```

Or manually with Docker Compose:

```bash
# Start MongoDB
docker-compose up -d

# Stop MongoDB (preserves data)
docker-compose down

# Stop and remove all data
docker-compose down -v
```

**Option B: Local MongoDB installation**

```bash
# macOS with Homebrew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Verify it's running
mongosh --eval "db.version()"
```

**Option C: Cloud MongoDB**

Use a cloud service like MongoDB Atlas or Azure Cosmos DB (MongoDB API). Update the `MONGODB_URI` in your `.env` file with the cloud connection string.

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
│   ├── app/              # Next.js App Router pages
│   ├── collections/      # Payload CMS collections
│   │   ├── Users.ts      # User authentication collection
│   │   └── Products.ts   # Product inventory collection
│   ├── config/           # Configuration loading
│   ├── utils/            # Shared utilities
│   └── payload.config.ts # Payload CMS configuration
├── tests/
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── infra/
│   ├── azure/            # Azure Bicep templates
│   └── aws/              # AWS Terraform (future)
├── docs/                 # Architecture documentation
└── scripts/              # Utility scripts
```

## Collections

### Products Collection

The Products collection manages the donation product inventory with the following fields:

**Core Fields:**
- `name` (text, required, max 200 chars) - Product name
- `productId` (text, required, unique, max 100 chars) - Product ID (uppercase alphanumeric with hyphens/underscores)
- `description` (textarea) - Product description
- `productLine` (select, required) - Product line category: Equip, Empower, Respond, or Protect
- `productType` (select, required) - Product type: Activation, Subscription, or Add-on

**Funding Fields:**
- `fundsNeeded` (number, required, default 0) - Total funds needed
  - **UI:** Enter in dollars (e.g., 100 for $100, 50.50 for $50.50)
  - **Storage:** Automatically converted to cents (integers) for precision
- `fundsRaised` (number, required, default 0, editable) - Total funds raised
  - **UI:** Enter in dollars (e.g., 50 for $50, 25.75 for $25.75)
  - **Storage:** Automatically converted to cents (integers) for precision
- `amountToBeFunded` (number, calculated, read-only) - Automatically calculated as Funds Needed - Funds Raised
  - Displayed in sidebar (shown in cents)
  - Negative value = over-funded (all funds raised)
  - Positive value = funding still needed
- `fundingStatus` (text, calculated, read-only) - Visual funding progress indicator
  - Shows "🔴 ERROR: More than 100% of funds raised" when fundsRaised > fundsNeeded (red background)
  - Shows "⚠️ WARNING: Almost all funds raised (>90%)" when fundsRaised > 90% of fundsNeeded (yellow background)
  - Displayed in sidebar below Amount to be Funded
- `valueCents` (number, required, default 0) - Estimated value in cents (integer, min 0)

**Donation Tracking (Read-only):**
- `lastDonatedAt` (date) - Timestamp of last donation

**Metadata:**
- `tags` (array) - Tags for categorization
- `isActive` (checkbox, default true) - Active status
- `createdAt` (timestamp) - Auto-generated
- `updatedAt` (timestamp) - Auto-generated

**Validations:**
- Product ID must be uppercase alphanumeric with hyphens/underscores only
- Product ID is automatically normalized to uppercase
- Product Line and Product Type are required dropdown selections
- Funds (needed and raised) and value must be non-negative integers in cents
- `fundsRaised` is editable to allow manual adjustments
- `lastDonatedAt` is protected from manual modification

**Data Integrity Safeguards:**

The Products collection includes several automated safeguards:

1. **Product ID Normalization**: Automatically converts to uppercase and trims whitespace
2. **Monetary Value Normalization**: Rounds all monetary values to integers (cents)
3. **Protected Computed Fields**: `lastDonatedAt` cannot be manually modified
4. **Non-Negative Constraints**: All monetary values are clamped to 0 if negative
5. **Auto-Deactivation**: Products are automatically deactivated when `amountToBeFunded < 0` (over-funded)

See [`docs/data-integrity.md`](docs/data-integrity.md) for detailed documentation of all integrity rules.

## Architecture

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

## API Documentation

### Admin UI

- **URL:** `http://localhost:3000/admin`
- **Authentication:** Email/password (Payload built-in auth)
- **Collections:** Users, Products

### REST API Endpoints

Payload CMS automatically generates REST API endpoints for all collections:

**Products API:**
- `GET /api/products` - List all products (with pagination, filtering, sorting)
- `GET /api/products/:id` - Get a single product by ID
- `POST /api/products` - Create a new product
- `PATCH /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

**Users API:**
- `GET /api/users/me` - Get current authenticated user
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout
- `POST /api/users/first-register` - Create first admin user

**GraphQL API:**
- **URL:** `http://localhost:3000/api/graphql`
- **Playground:** `http://localhost:3000/api/graphql-playground`

### System APIs (v1)

**Coming in Prompt 04:** Custom `/api/v1/...` endpoints with API key authentication.

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
