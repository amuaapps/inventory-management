# Architecture — Donation Product Inventory

**Version:** 1.0.0  
**System:** `donation-product-inventory`  
**Stack:** Payload CMS 3.71.1, MongoDB-compatible database, Azure Container Apps

---

## Overview

This system provides a lightweight inventory management solution for donation products, combining:
- **Admin UI** (Payload Admin) for human operators to view and edit product funding data
- **Stable REST APIs** (`/api/v1/...`) for upstream/downstream system integration
- **Azure-native deployment** with serverless bias and blue/green deployment capability

---

## Why Payload CMS?

Payload CMS provides:
1. **Admin UI out-of-the-box** — No need to build CRUD interfaces manually
2. **Content APIs** — Built-in collection REST endpoints for internal use
3. **Type-safe schema definitions** — TypeScript-first with validation hooks
4. **Extensibility** — Custom endpoints, hooks, and business logic integration
5. **Self-hosted** — Full control over data and deployment

We use Payload as the **data layer and admin interface**, not as a public-facing CMS.

---

## API Strategy: Stable External Contract

### Internal vs External APIs

**Payload's built-in collection REST API** (`/api/products`) is considered **internal** and may change with Payload versions or schema evolution.

**Our stable API** (`/api/v1/...`) is the **external contract** for upstream/downstream systems:
- Versioned (`/v1/`) to allow future breaking changes without disrupting clients
- Uses `productId` (UUID) as the public identifier, not MongoDB internal IDs
- Implements domain-specific operations (atomic increment, computed fields)
- Calls Payload's Local API internally for data access

### Endpoints

```
GET  /api/v1/products              # List products (filter by fundraisingActive)
GET  /api/v1/products/:productId   # Get single product
POST /api/v1/products              # Create/upsert product
PUT  /api/v1/products/:productId/funding-required  # Update funding target
POST /api/v1/products/:productId/donate            # Atomic increment funded amount
PUT  /api/v1/products/:productId/fundraising-active # Toggle active status
```

All endpoints require API key authentication (`X-System-Api-Key` header).

---

## Data Integrity Rules

### Currency Precision Strategy

**Approach:** Store monetary values as **integer cents** internally, display as USD in admin/API.

- `fundedAmount` and `fundingRequired` are stored as integers (cents)
- Admin UI displays formatted USD (e.g., `$123.45`)
- API accepts/returns decimal USD but converts to/from cents internally
- Prevents floating-point precision errors
- Atomic operations work reliably on integers

### Percent Funded Calculation

```typescript
percentFunded = fundingRequired > 0 
  ? (fundedAmount / fundingRequired) * 100 
  : 0
```

- Always computed, never stored
- Handles division-by-zero safely (returns 0)
- Displayed in admin UI as read-only
- Included in API responses

### Atomic Increment for Donations

Donation flow uses MongoDB's atomic increment operation:
```typescript
await Products.updateOne(
  { productId },
  { $inc: { fundedAmount: donationAmountInCents } }
)
```

Prevents race conditions when multiple donations occur simultaneously.

### Invariants

- `fundedAmount` cannot be negative (validated on write)
- `fundingRequired` must be >= 0
- `productId` must be valid UUID v4
- `productName` must be non-empty
- Funded amount **can exceed** funding required (documented behavior; allows over-funding)

---

## Azure Deployment Architecture

### Serverless Bias Alignment

Per `agents.md`, we prefer serverless/ephemeral compute. However, Payload CMS is a **long-running Node.js application** (not a function-per-request model).

**Solution:** **Azure Container Apps**
- Serverless container platform (scale-to-zero capable)
- Supports long-running HTTP services
- Built-in ingress, TLS, and traffic splitting
- Aligns with serverless principles while accommodating Payload's architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│ GitHub Actions (CI/CD)                                      │
│ ├─ Stage 1: Test (lint/type/unit/integration/security)     │
│ ├─ Stage 2: Build (container image → GHCR)                 │
│ ├─ Stage 3: Deploy GREEN revision (0% traffic)             │
│ └─ Stage 4: Test GREEN → Switch traffic BLUE→GREEN         │
└─────────────────────────────────────────────────────────────┘
                          ↓ OIDC Auth
┌─────────────────────────────────────────────────────────────┐
│ Azure Resource Group (Contributor scope)                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Container Apps Environment                           │  │
│  │  ├─ Container App (Payload server)                   │  │
│  │  │   ├─ BLUE revision (100% traffic initially)       │  │
│  │  │   └─ GREEN revision (0% → 100% after tests pass)  │  │
│  │  └─ Ingress: HTTPS                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Cosmos DB (MongoDB API)                              │  │
│  │  └─ Database: donation-inventory                     │  │
│  │     └─ Collection: products                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Log Analytics Workspace                              │  │
│  │  └─ Container Apps logs                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Application Insights (optional)                      │  │
│  │  └─ Telemetry and monitoring                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Database Choice

**Azure Cosmos DB with MongoDB API** provides:
- Fully managed MongoDB-compatible service
- No self-managed infrastructure
- Global distribution capability (future)
- Automatic backups
- SLA-backed availability

Alternative considered: Azure Container Instances with MongoDB container (rejected due to operational overhead and lack of managed backups).

---

## Blue/Green Deployment on Azure

### Revision-Based Traffic Splitting

Azure Container Apps supports **multiple active revisions** with traffic weight distribution.

### Deployment Flow

1. **Current state:** BLUE revision serves 100% of traffic
2. **Stage 3 (Deploy GREEN):**
   - Deploy new container image as GREEN revision
   - Set traffic weight: BLUE=100%, GREEN=0%
   - GREEN is live but receives no production traffic
3. **Stage 4 (Test GREEN):**
   - Run integration tests against GREEN revision URL (via revision-specific endpoint)
   - Run infrastructure validation (Bicep what-if, IaC scanning)
   - **Gate decision:** Only proceed if all tests pass
4. **Traffic Switch:**
   - Update traffic weights: BLUE=0%, GREEN=100%
   - GREEN becomes production
   - BLUE remains deployed for quick rollback if needed
5. **Rollback capability:**
   - If issues detected post-switch, revert traffic to BLUE instantly
   - No redeployment required

### Zero-Downtime Guarantee

- Both revisions run simultaneously during switch
- Traffic shift is atomic from Azure's perspective
- No connection drops during transition
- Health checks ensure GREEN is ready before receiving traffic

---

## Security Model

### Admin UI Access

- **Payload's built-in authentication** (email/password)
- Admin users managed via Payload's user collection
- Bootstrap mechanism for first admin (env-flag controlled, disabled in production)
- Session-based authentication

### System API Access (`/api/v1/...`)

- **API key authentication** via `X-System-Api-Key` header
- Key stored in `SYSTEM_API_KEY` environment variable (GitHub Secret)
- **Fail closed:** Missing or invalid key returns `401 Unauthorized`
- No anonymous access allowed

### Secrets Management

- All secrets stored as **GitHub Secrets** (never in repo)
- Passed to Azure Container Apps as **secret environment variables**
- Secrets never logged in CI/CD pipelines
- Required secrets:
  - `PAYLOAD_SECRET` (Payload encryption key)
  - `SYSTEM_API_KEY` (API authentication)
  - `MONGODB_URI` (Cosmos DB connection string)

### Network Security

- Container Apps ingress: HTTPS only (TLS 1.2+)
- Cosmos DB: Firewall rules limit access to Azure services
- No public MongoDB port exposure

---

## Alignment with `agents.md`

This architecture adheres to all requirements from `agents.md`:

### MACH Principles
- ✅ **Microservices:** Single-purpose inventory service
- ✅ **API-first:** Stable REST API contract (`/api/v1/...`)
- ✅ **Cloud-native:** Azure Container Apps, Cosmos DB
- ✅ **Headless:** Backend-only; UI is admin interface, not customer-facing

### TypeScript Standards
- ✅ Strict mode enabled
- ✅ No `any` types
- ✅ Type-safe schema definitions

### Testing Requirements
- ✅ Jest unit tests (domain logic, auth middleware)
- ✅ Integration tests (real MongoDB, API contract validation)
- ✅ Coverage thresholds enforced in CI

### CI/CD Pipeline (4 Stages)
- ✅ Stage 1: Test (lint, type, format, unit, integration, CodeQL, npm audit)
- ✅ Stage 2: Build (container image to GHCR)
- ✅ Stage 3: Deploy GREEN (0% traffic)
- ✅ Stage 4: Test infra + integration → traffic switch

### Security
- ✅ Fail closed on auth failures
- ✅ Least privilege (Contributor at resource group scope only)
- ✅ No secrets in repo or logs
- ✅ Automated security scanning (CodeQL, npm audit, IaC scanning)

### Infrastructure
- ✅ Bicep templates in `infra/azure/`
- ✅ Resource group scope (no subscription-level operations)
- ✅ No role assignments in templates
- ✅ Placeholder for AWS in `infra/aws/` (future)

---

## Future Enhancements

### Multi-Cloud (AWS)
- Add Terraform in `infra/aws/`
- Deploy to AWS Fargate or App Runner
- Use Amazon DocumentDB (MongoDB-compatible)

### Observability
- Structured logging with correlation IDs
- Distributed tracing (Application Insights or OpenTelemetry)
- Custom metrics for donation volume, funding progress

### Advanced Features
- Webhook notifications when products reach funding goals
- GraphQL API alongside REST
- Multi-region deployment with Cosmos DB global distribution
- Rate limiting on public APIs

---

## Glossary

- **BLUE/GREEN:** Deployment strategy with two production environments; traffic switches atomically
- **Payload CMS:** Headless CMS framework providing admin UI and content APIs
- **Container Apps:** Azure's serverless container platform
- **Cosmos DB:** Azure's globally distributed, multi-model database service
- **OIDC:** OpenID Connect; federated authentication for GitHub Actions to Azure
- **Atomic increment:** Database operation that modifies a value without race conditions

---

**Document Status:** ✅ Complete  
**Last Updated:** 2026-01-18
