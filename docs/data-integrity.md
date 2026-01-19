# Data Integrity Rules

This document describes the data integrity safeguards implemented in the Products collection to ensure data consistency and prevent corruption.

## Overview

The Products collection implements multiple layers of data integrity protection:
1. Field-level validation
2. Pre-validation normalization hooks
3. Pre-change protection hooks
4. Database-level constraints (unique indexes, etc.)

## Integrity Rules

### Rule 1: Product ID Normalization

**What:** Product ID values are automatically normalized to uppercase with trimmed whitespace.

**Why:** 
- Ensures consistency across the system
- Prevents accidental duplicates due to case differences
- Makes searching and matching more reliable

**Implementation:**
- Hook: `beforeValidate`
- Action: `data.productId = data.productId.toUpperCase().trim()`

**Example:**
```javascript
// Input:  " prod-001 "
// Stored: "PROD-001"
```

---

### Rule 2: Monetary Value Normalization

**What:** All monetary values (`valueCents`) are rounded to the nearest integer.

**Why:**
- Prevents floating-point precision errors
- Ensures all monetary values are stored as whole cents
- Maintains consistency with the "cents as integers" pattern

**Implementation:**
- Hook: `beforeValidate`
- Action: `data.valueCents = Math.round(Number(data.valueCents))`

**Example:**
```javascript
// Input:  1050.7  (someone tries to store $10.507)
// Stored: 1051    ($10.51)

// Input:  1050.4
// Stored: 1050    ($10.50)
```

**Note:** This uses standard rounding (0.5 rounds up). All monetary calculations should be done in cents to avoid precision issues.

---

### Rule 3: Quantity Normalization

**What:** Quantity values (`quantityAvailable`) are rounded to the nearest integer.

**Why:**
- Quantities must be whole numbers (you can't have 2.5 items)
- Prevents data corruption from decimal inputs
- Ensures consistency across the system

**Implementation:**
- Hook: `beforeValidate`
- Action: `data.quantityAvailable = Math.round(Number(data.quantityAvailable))`

**Example:**
```javascript
// Input:  10.7
// Stored: 11

// Input:  10.4
// Stored: 10
```

---

### Rule 4: Computed Field Protection

**What:** The fields `donationCount` and `lastDonatedAt` are protected from manual modification.

**Why:**
- These are derived/computed fields that should only be updated through donation operations
- Manual modification would break data consistency
- Prevents accidental or malicious data corruption

**Implementation:**
- Hook: `beforeChange`
- On create: Initialize to safe defaults (`donationCount = 0`, `lastDonatedAt = undefined`)
- On update: Restore original values if modified

**Behavior:**
```javascript
// On create
donationCount = 0
lastDonatedAt = undefined

// On update - if someone tries to change these fields:
data.donationCount = originalDoc.donationCount     // Restored
data.lastDonatedAt = originalDoc.lastDonatedAt     // Restored
```

**Note:** These fields will be updated through dedicated donation increment operations (to be implemented in future prompts).

---

### Rule 5: Non-Negative Value Constraints

**Rule:** All monetary and quantity values must be non-negative (≥ 0).

**Implementation:**
- Field-level `min: 0` validation on all numeric fields
- Collection-level `beforeChange` hook that clamps negative values to 0
- This provides defense-in-depth: validation catches user input, hook catches edge cases

**Fields affected:**
- `fundsNeeded`
- `fundsRaised`
- `valueCents`
  data.quantityAvailable = 0;
}

if (data.valueCents < 0) {
  data.valueCents = 0;
}
```

**Note:** This is a safety net. The field-level validation should prevent negative values from being submitted, but this hook provides defense-in-depth.

---

### Rule 6: Donation Count Protection

**What:** `donationCount` cannot be negative.

**Why:**
- You can't have negative donations
- Protects against data corruption from manual DB edits
- Ensures data consistency

**Implementation:**
- Hook: `beforeChange`
- Action: Clamp to 0 if negative

**Behavior:**
```javascript
if (data.donationCount < 0) {
  data.donationCount = 0;
}
```

---

## Validation vs. Normalization vs. Protection

The system uses three layers of data integrity:

### 1. Field-Level Validation
- **When:** Before data is accepted
- **Purpose:** Reject invalid input
- **Example:** SKU must match pattern `^[A-Z0-9-_]+$`

### 2. Normalization Hooks (`beforeValidate`)
- **When:** Before validation runs
- **Purpose:** Transform input to canonical form
- **Example:** Convert SKU to uppercase

### 3. Protection Hooks (`beforeChange`)
- **When:** After validation, before database write
- **Purpose:** Enforce invariants and protect computed fields
- **Example:** Restore original `donationCount` if modified

## Testing Data Integrity

To verify data integrity rules are working:

### Test 1: Monetary Value Rounding
```bash
# Create product with decimal value
POST /api/products
{
  "name": "Test Product",
  "productId": "TEST-001",
  "productLine": "equip",
  "productType": "activation",
  "valueCents": 1050.7
}

# Verify it's stored as 1051
GET /api/products/:id
# Should return valueCents: 1051
```

### Test 2: Computed Field Protection
```bash
# Create product
POST /api/products
{
  "name": "Test Product",
  "productId": "TEST-002",
  "productLine": "empower",
  "productType": "subscription",
  "donationCount": 999  # Try to set manually
}

# Verify donationCount is 0
GET /api/products/:id
# Should return donationCount: 0

# Try to update donationCount
PATCH /api/products/:id
{
  "donationCount": 999
}

# Verify it remains unchanged
GET /api/products/:id
# Should still return donationCount: 0
```

### Test 3: Negative Value Protection
```bash
# Try to create product with negative values
POST /api/products
{
  "name": "Test Product",
  "productId": "TEST-003",
  "productLine": "respond",
  "productType": "addon",
  "quantityAvailable": -10,
  "valueCents": -100
}

# Should be rejected by validation
# Response: 400 Bad Request
```

## Future Considerations

### Donation Operations
When implementing donation increment operations (future prompts), ensure:
1. Use atomic operations (`$inc`) for `donationCount`
2. Update `lastDonatedAt` in the same transaction
3. Never allow direct field updates - only through dedicated endpoints

### Audit Trail
Consider adding:
- Change tracking for quantity and value modifications
- Audit log for who changed what and when
- Alerts for unusual changes (e.g., large quantity drops)

### Race Conditions
For high-traffic scenarios:
- Use MongoDB transactions for multi-field updates
- Implement optimistic locking with version fields
- Consider using `findOneAndUpdate` with atomic operators

## Summary

These data integrity rules ensure:
- ✅ Monetary values are always stored as integers (no floating-point errors)
- ✅ Quantities are always whole numbers
- ✅ Computed fields cannot be manually corrupted
- ✅ Values cannot drop below 0
- ✅ Data remains consistent across all operations
- ✅ Multiple layers of protection (validation + normalization + hooks)
