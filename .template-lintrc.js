'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    'block-indentation': false,
    'link-href-attributes': false,
    'no-action': false,
    'no-curly-component-invocation': {
      allow: [
        'liquid-child',
        'liquid-container',
        'liquid-versions',
        'liquid-outlet',
        '-with-dynamic-vars',
      ],
    },
    'no-implicit-this': false,
    'no-invalid-role': false,
    'no-outlet-outside-routes': false,
    'no-yield-only': false,
    'require-input-label': false,
    'require-valid-alt-text': false,
  },
};
