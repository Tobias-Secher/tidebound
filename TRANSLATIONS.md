# Translation System Documentation

This document explains how the internationalization (i18n) system works in this project.

## Overview

The translation system uses a **CMS-first approach** with Payload CMS as the source of truth for all translations. It integrates with `next-intl` for type-safe translations in Next.js applications.

### Key Features

- ✅ CMS-based translation management
- ✅ Automatic fallback: `requested locale → English → translation key`
- ✅ Type-safe translation keys via TypeScript
- ✅ Nested namespace support
- ✅ Infinite caching with tag-based revalidation

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Payload CMS Database                     │
│  Translation documents with key, namespace, and             │
│  translations for each locale (en, da, etc.)                │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP GET /api/translations?locale=da
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              fetchCMSTranslations (Runtime)                  │
│  - Fetches flat translation documents from CMS              │
│  - Applies infinite caching with revalidation tags          │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Array<Translation>
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              flatToNested (Transformer)                      │
│  - Converts flat keys to nested objects                     │
│  - Applies fallback logic: locale → en → key                │
│  - Builds namespace hierarchy                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Nested translation object
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    next-intl Provider                        │
│  - Makes translations available via hooks                   │
│  - Provides type safety based on en.json                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  React Components                            │
│  Access translations via useTranslations/getTranslations    │
│  hooks with full TypeScript support                         │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Storage in CMS

Translations are stored as individual documents in Payload CMS. Each document represents a single translation key across all supported locales.

**Document Structure:**
- **key**: The identifier for the translation (e.g., "title", "submit")
- **namespace**: Organizational grouping (e.g., "HomePage", "common", "forms")
- **translations**: Object containing the actual text for each locale (en, da)
- **description**: Optional context for translators
- **tags**: Optional categorization for organization

**Important Concept:** Each translation document is NOT locale-specific. Instead, one document contains the translations for ALL locales for a given key. This makes it easy to see all translations for a key in one place and ensures consistency.

### 2. Fetching from CMS

**Location:** `packages/i18n/src/fetchers/cmsTranslations.ts`

The fetching process happens at runtime when a page is requested:

1. **API Request**: Makes an HTTP GET request to the CMS API endpoint `/api/translations` with query parameters for locale, limit, depth, and published status
2. **Caching Strategy**: Uses Next.js's built-in fetch caching with infinite revalidation (never expires automatically)
3. **Cache Tags**: Attaches two tags for manual revalidation:
   - Locale-specific tag (e.g., "translations-da")
   - Global translations tag ("translations")
4. **Error Handling**: Returns `null` if the fetch fails, allowing the request handler to decide how to proceed
5. **Transformation**: Immediately passes the fetched documents to `flatToNested` for structure conversion

**Key Points:**
- Fetches ALL published translations in one request (up to 10,000 documents)
- Never expires from cache unless manually revalidated
- The locale parameter is passed but the API returns all locale data for each key
- Only fetches published translations (drafts are excluded)

### 3. Transformation with `flatToNested`

**Location:** `packages/i18n/src/utils/transformTranslations.ts`

The transformer is responsible for converting the flat array of translation documents from the CMS into the nested object structure that `next-intl` expects.

#### How It Works

**Input**: Array of translation documents where each document has a key, namespace, and translations object

**Output**: Nested object where translations are organized by namespace, then by key

**Process:**

1. **Fallback Logic**: For each document, it attempts to get the translation value in this order:
   - First, try the requested locale (e.g., Danish)
   - If missing, fall back to English
   - If English is also missing, use the key itself (makes missing translations visible)

2. **Key Construction**: Builds the full key path by checking if the key already includes the namespace via dot notation. If not, it prepends the namespace.

3. **Nested Structure Building**: Splits the full key by dots and navigates through the result object, creating nested objects as needed. Sets the final value at the deepest level.

#### Transformation Example Flow

**Before Transformation (Flat):**
- Document 1: key="title", namespace="HomePage", translations={en:"Welcome", da:"Velkommen"}
- Document 2: key="subtitle", namespace="HomePage", translations={en:"Your CMS", da:null}
- Document 3: key="submit", namespace="common", translations={en:"Submit", da:"Indsend"}

**After Transformation (Nested):**
```
HomePage
  ├── title: "Velkommen" (Danish found)
  └── subtitle: "Your CMS" (Fell back to English)
common
  └── submit: "Indsend" (Danish found)
```

#### Fallback Behavior Details

The three-tier fallback system ensures translations always have a value:

**Tier 1 - Requested Locale**: Checks if the translation exists for the requested locale. If found, uses it immediately.

**Tier 2 - English Fallback**: If the requested locale translation is missing or null, falls back to the English translation. This ensures all supported locales can display content even if not fully translated.

**Tier 3 - Key Fallback**: If both the requested locale AND English are missing, displays the key itself (e.g., "title"). This is intentional for development/debugging - it makes missing translations immediately visible on the website rather than showing blank spaces.

**Why This Matters**: The fallback to showing the key ensures developers and content managers can see exactly which translations are missing when viewing the site. It's a development aid that prevents silent failures.

### 4. Runtime Request Configuration

**Location:** `packages/i18n/src/request.ts`

This file configures how `next-intl` loads translations for each incoming request.

**Process Flow:**

1. **Locale Determination**: Extracts the requested locale from the request. If the locale isn't in the supported list, defaults to English.

2. **CMS Fetch**: Calls `fetchCMSTranslations` with the determined locale to get the nested translation object.

3. **Success Case**: If translations are returned and the object has keys, provides them to `next-intl`.

4. **Failure Case**: If the CMS fetch returns null or an empty object, logs an error and returns empty messages. The app will render but with missing translations.

**Important Design Decision**: There is NO fallback to JSON files at runtime. The CMS is the single source of truth. If the CMS is unavailable, the app shows empty translations rather than using stale data from files.

## Type Safety System

Type safety is achieved through a generated `en.json` file that serves as the TypeScript definition source.

### How Type Generation Works

**Script Location:** `packages/i18n/scripts/generateTypes.ts`

**Process:**

1. **Manual Trigger**: Developer runs `pnpm generate:translations` command
2. **Environment Loading**: Script uses the `--env-file` flag to load the root `.env.local` containing the `API_URL`
3. **CMS Fetch**: Makes a direct HTTP request to fetch all published translations from the CMS
4. **Transform**: Passes the translations through `flatToNested` specifically for the English locale
5. **Write File**: Writes the resulting nested object to `packages/i18n/messages/en.json` as formatted JSON
6. **TypeScript Inference**: TypeScript automatically infers the structure of this JSON file and enforces it throughout the codebase

### Why English for Types?

English is used as the type definition source because:
- It's the default/fallback locale
- All translations MUST have an English value (enforced in CMS)
- Ensures type definitions are always complete and stable
- Other locales can have missing translations (they fall back to English)

### Type Safety in Action

When you use translation hooks in components, TypeScript knows:
- Which namespaces exist
- Which keys exist within each namespace
- That attempting to access non-existent keys is an error

This is all inferred from the structure of `en.json` without manual type definitions.

## Environment Configuration

### Required Variables

Both the runtime application and the type generation script need access to the CMS URL.

**Root `.env.local`**: Used by the generation script when run via turbo
**App-specific `.env.local`**: Used by the web application at runtime

**Critical Detail**: The `API_URL` should contain ONLY the base URL (e.g., `http://localhost:3001`). Do NOT include `/api` as a suffix. The fetcher automatically appends `/api/translations` to construct the full endpoint.

### Configuration File

**Location:** `packages/i18n/src/config.ts`

This file exports:
- `CMS_URL`: Reads from `process.env.API_URL`
- `TRANSLATION_CACHE_TAGS`: Object defining the cache tag structure for revalidation

The cache tags allow for granular cache invalidation:
- Invalidate all translations across all locales
- Invalidate just one specific locale

## Adding New Translations

### Via CMS Admin Panel

1. Navigate to the CMS admin interface at the API_URL
2. Access the Translations collection under Content
3. Create a new translation document
4. Fill in:
   - **Key**: Use dot notation for nested keys (e.g., "button.submit")
   - **Namespace**: Select existing or matches the organizational grouping
   - **English translation**: Required field
   - **Other locale translations**: Optional
   - **Description**: Context for translators (character limits, usage location, tone)
   - **Tags**: Optional organizational tags
5. Publish the document (drafts are not fetched by the app)

### Update Type Definitions

After adding translations in the CMS, regenerate the type file:

Run `pnpm generate:translations`

This ensures TypeScript recognizes the new keys and you get autocomplete and type checking.

### Use in Components

Access the new translations through `next-intl` hooks in server or client components. The namespace and key structure matches what you defined in the CMS.

## Supported Locales

**Location:** `packages/i18n/src/index.ts`

The supported locales are defined in a const array that determines which languages the app supports. The default locale is also specified here.

### Adding a New Locale

To support a new language:

1. **Update Locale Array**: Add the new locale code to the `locales` array in `index.ts`
2. **Update Type Definition**: Modify the `Translation` type in `@repo/api-types` to include a field for the new locale
3. **Update CMS Collection**: Add a new field to the Translations collection in Payload for the new locale
4. **Add Content**: Create or update translation documents in the CMS with content for the new locale
5. **Rebuild**: Restart the dev server and regenerate types

## Cache Revalidation

The translation system uses infinite caching with automatic revalidation when translations are published.

### Automatic Revalidation

**How It Works:**

1. **Cache Tagging**: Each translation fetch is tagged with:
   - Global tag: "translations"
   - Locale-specific tag: "translations-{locale}"

2. **Automatic Trigger**: The Translations collection has an `afterChange` hook that automatically revalidates the cache when:
   - A translation is published (status changes to "published")
   - An existing published translation is updated

3. **Revalidation Flow**:
   - CMS hook detects published translation
   - Directly calls `revalidateTag` from `next/cache`
   - Invalidates all translation caches immediately
   - Next request fetches fresh translations from CMS

**Implementation Details:**

Since this is a monorepo with Next.js installed globally, the CMS can import and call `revalidateTag` directly without needing HTTP requests or separate endpoints. The hook simply calls:

```
revalidateTag(TRANSLATION_CACHE_TAGS.all, "max")
```

This invalidates all cached translations across all locales immediately.

### Why This Approach

**Infinite Caching**: Translations load instantly from cache on every request.

**Automatic Updates**: Cache invalidates immediately when content is published - no configuration or manual steps required.

**Monorepo Benefits**: Direct function calls are simpler and faster than HTTP requests between apps.

**Performance with Freshness**: Users get fast cached responses, but see updates instantly after publishing.

## Troubleshooting

### Error: CMS translations unavailable for {locale}

**What It Means**: The `fetchCMSTranslations` function returned null or an empty object.

**Common Causes**:
- CMS server is not running
- `API_URL` environment variable is incorrect or missing
- Network connection issue between app and CMS
- No published translations exist in the CMS database
- Database connection issue in the CMS

**How to Debug**:
1. Verify the CMS is running and accessible
2. Check the `API_URL` value in both root and app `.env.local` files
3. Try accessing the API endpoint directly in a browser
4. Check the CMS admin to verify translations exist and are published
5. Review CMS server logs for errors

### Error: MISSING_MESSAGE: Could not resolve {key} in messages

**What It Means**: `next-intl` cannot find the requested translation key in the messages object.

**Common Causes**:
- Translation key doesn't exist in the CMS
- Translation exists but is in draft status (not published)
- The translation was added but types weren't regenerated
- Namespace mismatch between code and CMS

**How to Debug**:
1. Check the CMS for the exact key and namespace combination
2. Ensure the translation is published (not draft)
3. Run `pnpm generate:translations` to sync types
4. Verify you're using the correct namespace in the component

### Error: Failed to parse URL from undefined/api/translations

**What It Means**: The `API_URL` environment variable is undefined when the code tries to construct the fetch URL.

**Common Causes**:
- `.env.local` file doesn't exist or is in wrong location
- `API_URL` variable is misspelled or missing from the file
- Environment file isn't being loaded (script needs `--env-file` flag)
- Dev server needs restart to pick up new environment variables

**How to Debug**:
1. Verify `.env.local` exists in the root directory
2. Confirm `API_URL` is defined in the file
3. Check the package.json script includes `--env-file=../../.env.local`
4. Restart the development server
5. For scripts, ensure the tsx command has the env-file flag

### Translation Shows Key Instead of Text

**What It Means**: The fallback system has reached tier 3, displaying the key itself.

**What This Indicates**: Both the requested locale AND the English translation are missing from the CMS.

**How to Fix**:
1. Add an English translation (required) for the key in the CMS
2. Optionally add the requested locale translation
3. Publish the translation document
4. Clear cache or revalidate tags if changes don't appear immediately

## Best Practices

### Always Provide English Translations

English serves as the fallback locale. Every translation key MUST have an English value. This ensures:
- Type generation always has complete data
- All locales can fall back to readable content
- The fallback system works reliably

### Use Descriptive Keys

Keys should be self-documenting and indicate their purpose and location:
- Good: `forms.contact.submitButton`, `errors.validation.emailInvalid`
- Bad: `btn1`, `err`, `text`

This makes code more maintainable and helps when reviewing the translation list.

### Organize with Namespaces

Group related translations into logical namespaces:
- **HomePage**: Content specific to the homepage
- **common**: Shared UI elements used across the app
- **forms**: Form labels, placeholders, validation messages
- **errors**: Error messages
- **navigation**: Menu items, breadcrumbs, links

This organization makes translations easier to find and maintain.

### Add Context for Translators

Use the description field generously:
- Explain where the text appears in the UI
- Note any character limits or length constraints
- Specify tone (formal, casual, technical)
- Provide examples if the translation is dynamic
- Clarify any ambiguous terminology

Good descriptions lead to better, more accurate translations.

### Generate Types Regularly

Run `pnpm generate:translations` whenever you:
- Add new translation keys to the CMS
- Change namespaces or reorganize translations
- Before committing translation-related code changes
- When switching branches that might have translation changes

This keeps your TypeScript types in sync with the CMS content.

### Handle Missing Translations Gracefully

The key fallback is useful for development but not ideal for production. Consider:
- Setting up monitoring to detect when keys are displayed instead of translations
- Creating alerts when fallback tier 3 is used
- Implementing a review process before deploying to ensure all keys have translations
- Having a content management workflow that prevents publishing incomplete translations

## File Structure

```
packages/i18n/
├── src/
│   ├── index.ts                      # Locale configuration & re-exports
│   ├── config.ts                     # CMS URL & cache tag definitions
│   ├── request.ts                    # next-intl request configuration
│   ├── fetchers/
│   │   └── cmsTranslations.ts       # Runtime CMS fetch logic
│   └── utils/
│       └── transformTranslations.ts  # Flat-to-nested transformation
├── messages/
│   └── en.json                       # Generated TypeScript type source
└── scripts/
    └── generateTypes.ts              # Type generation script

apps/cms/
└── src/
    └── collections/
        └── Translations.ts           # Payload CMS collection schema

apps/web/
└── app/
    └── [locale]/                     # Locale-based routing structure
```

## Summary

The translation system follows this flow:

1. **Content Management**: Translations are created and managed in Payload CMS as flat documents
2. **Runtime Fetch**: When a page is requested, the app fetches all published translations for the locale
3. **Transformation**: The flat array is converted to a nested object with fallback logic applied
4. **Caching**: Translations are cached infinitely and only updated via manual revalidation
5. **Type Safety**: A generated JSON file provides TypeScript type definitions for all keys
6. **Component Usage**: React components access translations through `next-intl` hooks with full type safety

This architecture provides a flexible, scalable, and type-safe translation system while keeping content management centralized in the CMS.
