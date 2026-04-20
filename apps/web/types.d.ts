/// <reference types="@testing-library/jest-dom" />
/// <reference types="node" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css';
