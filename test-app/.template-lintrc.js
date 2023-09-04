'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-curly-component-invocation': {
      allow: ['-with-dynamic-vars'],
    },
  },
};
