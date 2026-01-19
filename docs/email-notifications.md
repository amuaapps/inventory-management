# Email Notifications

## Overview

The inventory management system sends automated email notifications when products reach critical funding thresholds.

## Email Adapter

Currently using a **stub email adapter** for development/testing that logs emails to the console instead of sending them.

**Location:** `src/email/stub-email-adapter.ts`

### Production Setup

To enable real email sending in production, replace the stub adapter with a real email service:

1. Install an email provider package (e.g., `nodemailer`, `sendgrid`, etc.)
2. Create a new email adapter in `src/email/`
3. Update `src/payload.config.ts` to use the production adapter
4. Configure environment variables for email credentials

## Notification Triggers

### Warning Email (⚠️)

**Condition:** When `fundsRaised > 90%` of `fundsNeeded`

**Sent to:** `admin@inventory.amua.app` (TODO: Configure actual admin email)

**Subject:** `⚠️ WARNING: Product Almost Fully Funded - {Product Name}`

**Content:**
- Product name and ID
- Funding percentage
- Funds needed and raised
- Remaining amount
- Warning message

### Error Email (🔴)

**Condition:** When `fundsRaised > 100%` of `fundsNeeded`

**Sent to:** `admin@inventory.amua.app` (TODO: Configure actual admin email)

**Subject:** `🔴 ERROR: Product Over-Funded - {Product Name}`

**Content:**
- Product name and ID
- Funding percentage
- Funds needed and raised
- Over-funded amount
- Error message requiring action

## Implementation Details

**Hook Location:** `src/collections/Products.ts`

**Field:** `amountToBeFunded` (calculated field)

**Hook Type:** `afterChange` - Fires after the field value is calculated and saved

**Logic:**
1. Calculate percentage funded: `(fundsRaised / fundsNeeded) * 100`
2. If > 100%: Send error email
3. Else if > 90%: Send warning email
4. Otherwise: No email sent

## Testing

When running in development mode with the stub adapter:

1. Edit a product's `fundsRaised` value
2. Set it to > 90% of `fundsNeeded` to trigger warning
3. Set it to > 100% of `fundsNeeded` to trigger error
4. Check console output for email notification logs

Example:
- Funds Needed: $100 (10000 cents)
- Funds Raised: $95 (9500 cents) → ⚠️ Warning email
- Funds Raised: $110 (11000 cents) → 🔴 Error email

## Configuration

**Admin Email:** Currently hardcoded to `admin@inventory.amua.app`

**TODO:** Move to environment variable:
```env
ADMIN_EMAIL=your-admin@example.com
```

Then update the hook to use `config.adminEmail` instead of hardcoded value.
