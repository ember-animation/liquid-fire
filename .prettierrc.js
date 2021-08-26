'use strict';

module.exports = {
  singleQuote: true,
  overrides: [
    {
      files: '**/*.hbs',
      options: {
        parser: 'glimmer',
        singleQuote: false,
      },
    },
  ],
};
