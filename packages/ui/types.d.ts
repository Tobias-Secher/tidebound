/// <reference types="@testing-library/jest-dom" />

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.svg' {
    const content: import('next/image').StaticImageData;
    export default content;
}