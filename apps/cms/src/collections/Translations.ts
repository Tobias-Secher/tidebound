import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";
import { locales } from "@repo/i18n";
import { collectionNames } from "@/collectionNames";
import { TRANSLATION_CACHE_TAGS } from "@repo/i18n/config";

export const Translations: CollectionConfig = {
  slug: collectionNames.translations,
  admin: {
    useAsTitle: "key",
    defaultColumns: ["key", "namespace", "updatedAt"],
    group: "Content",
  },
  access: {
    read: () => true, // Public read access for frontend
  },
  versions: {
    drafts: true, // Enable draft translations for publishing workflow
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc._status === "published") {
          try {
            revalidateTag(TRANSLATION_CACHE_TAGS.all, "max");
            req.payload.logger.info(
              `Translation cache revalidated for key: ${doc.key}`,
            );
          } catch (error) {
            req.payload.logger.error(
              `Failed to revalidate translations cache: ${error}`,
            );
          }
        }

        return doc;
      },
    ],
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description:
          'Translation key using dot notation (e.g., "HomePage.title" or "common.submit")',
      },
      // Enforce dot notation for nested keys
      validate: (value: unknown) => {
        if (typeof value !== "string") {
          return "Key must be a string";
        }
        if (!/^[a-zA-Z][a-zA-Z0-9._-]*$/.test(value)) {
          return "Key must start with a letter and contain only letters, numbers, dots, underscores, and hyphens";
        }
        return true;
      },
    },
    {
      name: "namespace",
      type: "select",
      required: true,
      defaultValue: "common",
      admin: {
        description: "Namespace/group for organizing translations",
        isClearable: false,
      },
      index: true, // For efficient querying
      options: [
        {
          label: "Common (shared across app)",
          value: "common",
        },
        {
          label: "HomePage",
          value: "HomePage",
        },
        {
          label: "Auth (login, signup, etc.)",
          value: "auth",
        },
        {
          label: "Navigation",
          value: "navigation",
        },
        {
          label: "Footer",
          value: "footer",
        },
        {
          label: "Forms",
          value: "forms",
        },
        {
          label: "Errors",
          value: "errors",
        },
        {
          label: "Success Messages",
          value: "success",
        },
        {
          label: "Validation",
          value: "validation",
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Context or usage notes for translators",
      },
    },
    {
      name: "translations",
      type: "group",
      fields: locales.map((locale) => ({
        name: locale,
        type: "text" as const,
        required: locale === "en", // English is required
        admin: {
          description: `Translation for ${locale.toUpperCase()}`,
        },
      })),
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
      admin: {
        description:
          'Tags for filtering and organizing translations (e.g., "landing-page", "checkout", "navigation")',
      },
    },
  ],
};
