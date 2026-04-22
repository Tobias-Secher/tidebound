const stylesFolder = `${__dirname}/../styles/src/css`;
const customMediaImports = [`${stylesFolder}/media.css`];
const mixinsFiles = `${stylesFolder}/**/*mixins.css`;

module.exports = {
  plugins: {
    'postcss-mixins': { mixinsFiles },
    'postcss-preset-env': {
      stage: 3,
      importFrom: customMediaImports,
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
