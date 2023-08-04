'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'link-href-attributes': false,
    'no-curly-component-invocation': {
      allow: ['-with-dynamic-vars'],
    },
  },
};
