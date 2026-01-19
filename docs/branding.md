# Custom Branding Guide

## Overview

This guide explains how to customize the logo and favicon in the Payload CMS admin panel.

## Current Status

✅ **Browser Favicon:** Working - Your Amua Apps star logo appears in browser tabs  
⚠️ **Admin Panel Logo:** Requires additional configuration (see below)

## Files Location

### Logo
**Path:** `/public/logo.svg`
- Used in the admin panel navigation bar
- Recommended size: 150x40px (or similar aspect ratio)
- Format: SVG (preferred) or PNG

### Favicon/Icon
**Path:** `/public/icon.svg`
- Used as the browser favicon
- Used as the collapsed nav icon
- Recommended size: 32x32px (square)
- Format: SVG (preferred) or PNG

## Configuration

The branding is configured in `src/payload.config.ts`:

```typescript
admin: {
  meta: {
    titleSuffix: '- Amua Apps Inventory',  // Browser tab title suffix
    favicon: '/icon.svg',                   // Browser favicon
    ogImage: '/logo.svg',                   // Open Graph image for social sharing
  },
  components: {
    graphics: {
      Icon: '/icon.svg',                    // Admin panel icon (collapsed nav)
      Logo: '/logo.svg',                    // Admin panel logo (expanded nav)
    },
  },
}
```

## Replacing the Placeholder Graphics

The current files are **placeholders**. To use your actual branding:

### 1. Replace the Logo

1. Create or export your logo as SVG (preferred) or PNG
2. Save it as `/public/logo.svg` (or `/public/logo.png`)
3. If using PNG, update the config:
   ```typescript
   Logo: '/logo.png',
   ogImage: '/logo.png',
   ```

**Recommended specifications:**
- Width: 120-200px
- Height: 30-50px
- Background: Transparent
- Format: SVG (scalable) or PNG (high-res)

### 2. Replace the Favicon/Icon

1. Create or export your icon as SVG (preferred) or PNG
2. Save it as `/public/icon.svg` (or `/public/icon.png`)
3. If using PNG, update the config:
   ```typescript
   Icon: '/icon.png',
   favicon: '/icon.png',
   ```

**Recommended specifications:**
- Size: 32x32px (square)
- Background: Transparent or solid color
- Format: SVG (scalable) or PNG (high-res)

## Additional Customization

### Browser Tab Title

Change the title suffix in the config:
```typescript
meta: {
  titleSuffix: '- Your Company Name',
}
```

This will appear as: `Dashboard - Your Company Name` in browser tabs.

### Theme Colors

To customize the admin panel colors, you can add custom CSS. Create a custom component:

1. Create `src/components/CustomCSS.tsx`:
```typescript
export const CustomCSS = () => (
  <style>{`
    :root {
      --theme-primary: #0070f3;
      --theme-secondary: #7928ca;
    }
  `}</style>
);
```

2. Add to config:
```typescript
admin: {
  components: {
    beforeDashboard: ['@/components/CustomCSS'],
  },
}
```

## What's Working Now

### ✅ Browser Favicon
Your custom Amua Apps star logo is working as the browser favicon:
- **Location:** `src/app/icon.svg`
- **Status:** ✅ Active - appears in browser tabs
- **How it works:** Next.js automatically uses `src/app/icon.svg` as the favicon

### ⚠️ Admin Panel Logo
The admin panel logo requires custom React components and importMap configuration:
- **Location:** `src/components/Logo.tsx` and `src/components/Icon.tsx` (created)
- **Config:** `src/payload.config.ts` (configured)
- **Status:** ⚠️ Needs importMap regeneration

## Next Steps for Admin Panel Logo

The admin panel logo customization requires Payload's importMap to be properly generated. There are two approaches:

### Option 1: Manual ImportMap (Recommended for now)
Wait for Payload to auto-generate the importMap on next server restart, or manually edit:
`src/app/(payload)/admin/importMap.js`

### Option 2: Use CSS Override (Quick workaround)
Add custom CSS to hide/replace the default Payload logo:

```typescript
// src/components/CustomAdminCSS.tsx
const CustomAdminCSS = () => (
  <style>{`
    /* Hide default Payload logo */
    nav [class*="logo"] {
      background-image: url('/logo.svg') !important;
      background-size: contain;
      background-repeat: no-repeat;
    }
  `}</style>
);

export default CustomAdminCSS;
```

Then add to config:
```typescript
admin: {
  components: {
    beforeDashboard: ['@/components/CustomAdminCSS'],
  },
}
```

## Testing

Current working features:
1. ✅ Browser tab shows your custom favicon
2. ✅ Browser tab title shows "Dashboard - Amua Apps Inventory"
3. ⚠️ Admin panel logo still shows Payload default (needs importMap fix)

## Production Deployment

The `/public` folder and `src/app/icon.svg` are automatically included in production builds.
