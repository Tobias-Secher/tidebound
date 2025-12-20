/// <reference types="@testing-library/jest-dom" />
/// <reference types="@repo/i18n/i18n.d.ts" />
/// <reference types="node" />

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
