import Ember from 'ember';

/**
 * Make sure we return a 500 on exceptions, so that our test suite will notice them.
 *
 */
export default {
  name: 'error-handler',

  initialize: function (instance) {
    if (typeof FastBoot !== 'undefined') {
      Ember.onerror = function (err) {
        let errorMessage = `There was an error running your app in fastboot. More info about the error: \n ${
          err.stack || err
        }`;
        console.error(errorMessage);
        instance.lookup('service:fastboot').set('response.statusCode', 500);
      };
    }
  },
};
