const stylesBase = './node_modules/@repo/styles/src/css';

export default {
  plugins: {
    'postcss-mixins': {
      mixinsFiles: `${stylesBase}/**/*mixins.css`,
    },
    '@csstools/postcss-global-data': {
      files: [`${stylesBase}/media.css`],
    },
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-media-queries': true,
        'custom-properties': false,
        'nesting-rules': true,
        'custom-selectors': true,
        'color-functional-notation': true,
        'has-pseudo-class': true,
      },
    },
  },
};
