declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Storybook's type exports require 'node16'/'nodenext' moduleResolution,
// but this project uses 'Bundler'. This declaration resolves the type error.
declare module '@storybook/react-webpack5';
