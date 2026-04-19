/// <reference types="jest" />

import 'ky';

declare module 'ky' {
  interface Options {
    next?: {
      tags?: string[];
      revalidate?: number | false;
    };
  }
}