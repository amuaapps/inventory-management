import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'productId', 'productLine', 'productType', 'fundsNeeded', 'fundsRaised', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 200,
      admin: {
        description: 'Product name (max 200 characters)',
      },
    },
    {
      name: 'productId',
      type: 'text',
      required: true,
      unique: true,
      maxLength: 100,
      admin: {
        description: 'Product ID - must be unique',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Product ID is required';
        if (!/^[A-Z0-9-_]+$/.test(value)) {
          return 'Product ID must contain only uppercase letters, numbers, hyphens, and underscores';
        }
        return true;
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Product description',
      },
    },
    {
      name: 'productLine',
      type: 'select',
      required: true,
      options: [
        { label: 'Equip', value: 'equip' },
        { label: 'Empower', value: 'empower' },
        { label: 'Respond', value: 'respond' },
        { label: 'Protect', value: 'protect' },
      ],
      admin: {
        description: 'Product line category',
      },
    },
    {
      name: 'productType',
      type: 'select',
      required: true,
      options: [
        { label: 'Activation', value: 'activation' },
        { label: 'Subscription', value: 'subscription' },
        { label: 'Add-on', value: 'addon' },
      ],
      admin: {
        description: 'Product type',
      },
    },
    {
      name: 'fundsNeeded',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        description: '💵 Enter in dollars (e.g., 100 for $100, 50.50 for $50.50). Automatically converted to cents for storage.',
        step: 0.01,
      },
      validate: (value: number | null | undefined) => {
        if (value == null) return true;
        if (value < 0) return 'Funds needed cannot be negative';
        if (!Number.isInteger(value)) return 'Funds must be in cents (whole number)';
        return true;
      },
    },
    {
      name: 'fundsRaised',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        description: '💵 Enter in dollars (e.g., 50 for $50, 25.75 for $25.75). Compare with Funds Needed to track progress.',
        step: 0.01,
      },
      validate: (value: number | null | undefined) => {
        if (value == null) return true;
        if (value < 0) return 'Funds raised cannot be negative';
        if (!Number.isInteger(value)) return 'Funds must be in cents (whole number)';
        return true;
      },
    },
    {
      name: 'amountToBeFunded',
      type: 'number',
      admin: {
        readOnly: true,
        description: '💰 Calculated: Funds Needed - Funds Raised (in cents)',
        position: 'sidebar',
        step: 1,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const needed = typeof siblingData?.fundsNeeded === 'number' ? siblingData.fundsNeeded : 0;
            const raised = typeof siblingData?.fundsRaised === 'number' ? siblingData.fundsRaised : 0;
            return needed - raised;
          },
        ],
        afterChange: [
          async ({ siblingData, req }) => {
            const needed = typeof siblingData?.fundsNeeded === 'number' ? siblingData.fundsNeeded : 0;
            const raised = typeof siblingData?.fundsRaised === 'number' ? siblingData.fundsRaised : 0;
            
            // Avoid division by zero
            if (needed === 0) return;
            
            const percentageFunded = (raised / needed) * 100;
            const productName = siblingData?.name || 'Unknown Product';
            const productId = siblingData?.productId || 'N/A';
            
            // Send error email if over 100% funded
            if (percentageFunded > 100) {
              await req.payload.sendEmail({
                to: 'admin@inventory.amua.app', // TODO: Replace with actual admin email
                subject: `🔴 ERROR: Product Over-Funded - ${productName}`,
                html: `
                  <h2>🔴 ERROR: Product Over-Funded</h2>
                  <p><strong>Product:</strong> ${productName}</p>
                  <p><strong>Product ID:</strong> ${productId}</p>
                  <p><strong>Funding Status:</strong> ${percentageFunded.toFixed(1)}% funded</p>
                  <p><strong>Funds Needed:</strong> $${(needed / 100).toFixed(2)}</p>
                  <p><strong>Funds Raised:</strong> $${(raised / 100).toFixed(2)}</p>
                  <p><strong>Over-funded by:</strong> $${((raised - needed) / 100).toFixed(2)}</p>
                  <hr>
                  <p>This product has exceeded its funding goal. Please review and take appropriate action.</p>
                `,
              });
            }
            // Send warning email if over 90% funded (but not over 100%)
            else if (percentageFunded > 90) {
              await req.payload.sendEmail({
                to: 'admin@inventory.amua.app', // TODO: Replace with actual admin email
                subject: `⚠️ WARNING: Product Almost Fully Funded - ${productName}`,
                html: `
                  <h2>⚠️ WARNING: Product Almost Fully Funded</h2>
                  <p><strong>Product:</strong> ${productName}</p>
                  <p><strong>Product ID:</strong> ${productId}</p>
                  <p><strong>Funding Status:</strong> ${percentageFunded.toFixed(1)}% funded</p>
                  <p><strong>Funds Needed:</strong> $${(needed / 100).toFixed(2)}</p>
                  <p><strong>Funds Raised:</strong> $${(raised / 100).toFixed(2)}</p>
                  <p><strong>Remaining:</strong> $${((needed - raised) / 100).toFixed(2)}</p>
                  <hr>
                  <p>This product is almost fully funded. Only ${(100 - percentageFunded).toFixed(1)}% remaining.</p>
                `,
              });
            }
          },
        ],
      },
    },
    {
      name: 'fundingStatus',
      type: 'textarea',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Funding progress indicator',
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const needed = typeof siblingData?.fundsNeeded === 'number' ? siblingData.fundsNeeded : 0;
            const raised = typeof siblingData?.fundsRaised === 'number' ? siblingData.fundsRaised : 0;
            
            // Avoid division by zero
            if (needed === 0) return 'No funds needed set';
            
            const percentageFunded = (raised / needed) * 100;
            
            if (percentageFunded > 100) {
              return `🔴 ERROR: More than 100% of funds raised (${percentageFunded.toFixed(1)}%)`;
            } else if (percentageFunded > 90) {
              return `⚠️ WARNING: Almost all funds raised (${percentageFunded.toFixed(1)}%)`;
            }
            return `Funding progress: ${percentageFunded.toFixed(1)}%`;
          },
        ],
      },
    },
    {
      name: 'lastDonatedAt',
      type: 'date',
      admin: {
        description: 'Timestamp of the last donation',
        readOnly: true,
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for categorization and search',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          maxLength: 50,
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this product is active in the system',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        /**
         * DATA INTEGRITY RULE 1: Normalize Product ID to uppercase
         * - Product ID must always be uppercase for consistency
         * - Trim whitespace to prevent accidental duplicates
         */
        if (data?.productId) {
          data.productId = data.productId.toUpperCase().trim();
        }

        /**
         * DATA INTEGRITY RULE 2: Normalize monetary values to integers (cents)
         * - All monetary values must be stored as integers in cents
         * - Round any decimal values to nearest integer
         * - This prevents floating-point precision errors
         */
        if (data?.valueCents != null) {
          data.valueCents = Math.round(Number(data.valueCents));
        }
        if (data?.fundsNeeded != null) {
          data.fundsNeeded = Math.round(Number(data.fundsNeeded));
        }
        if (data?.fundsRaised != null) {
          data.fundsRaised = Math.round(Number(data.fundsRaised));
        }

        return data;
      },
    ],
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        /**
         * DATA INTEGRITY RULE 4: Protect computed fields from manual modification
         * - lastDonatedAt is a derived/computed field
         * - It should only be updated through donation operations, never manually
         * - On create: initialize to safe default
         * - On update: restore original value if someone tries to modify it
         * 
         * NOTE: fundsRaised is now editable to allow manual adjustments
         */
        if (operation === 'create') {
          // Initialize computed fields to safe defaults
          if (data.fundsRaised == null) {
            data.fundsRaised = 0;
          }
          data.lastDonatedAt = undefined;
        } else if (operation === 'update' && originalDoc) {
          // Prevent manual modification of lastDonatedAt only
          data.lastDonatedAt = originalDoc.lastDonatedAt;
        }

        /**
         * DATA INTEGRITY RULE 5: Enforce non-negative constraints
         * - Funds and value cannot drop below 0
         * - Clamp to 0 if negative values somehow get through validation
         * - This is a safety net in addition to field-level validation
         */
        if (data?.fundsNeeded != null && data.fundsNeeded < 0) {
          data.fundsNeeded = 0;
        }
        if (data?.fundsRaised != null && data.fundsRaised < 0) {
          data.fundsRaised = 0;
        }
        if (data?.valueCents != null && data.valueCents < 0) {
          data.valueCents = 0;
        }

        /**
         * DATA INTEGRITY RULE 6: Auto-deactivate products with negative funding balance
         * - If amountToBeFunded (fundsNeeded - fundsRaised) drops below 0, auto-uncheck isActive
         * - This prevents over-funded products from remaining active
         * - Calculated after clamping to ensure accurate values
         */
        const fundsNeeded = typeof data?.fundsNeeded === 'number' ? data.fundsNeeded : 0;
        const fundsRaised = typeof data?.fundsRaised === 'number' ? data.fundsRaised : 0;
        const amountToBeFunded = fundsNeeded - fundsRaised;
        
        if (amountToBeFunded < 0) {
          data.isActive = false;
        }

        return data;
      },
    ],
  },
  timestamps: true,
};
