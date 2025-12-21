/// <reference types="next" />

/**
 * Extends the global fetch to include Next.js-specific options
 * This enables TypeScript to recognize the 'next' property in fetch options
 */
declare global {
  interface RequestInit {
    next?: {
      revalidate?: number | false
      tags?: string[]
    }
  }
}

export {}
