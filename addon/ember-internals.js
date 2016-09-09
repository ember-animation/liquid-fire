/*
  This module is intended to encapsulate all the known places where
  liquid-fire depends on non-public Ember APIs.

  See also tests/helpers/ember-testing-internals.js, which does the
  same thing but for code that is only needed in the test environment.

 */

// These things are the same for all supported Ember versions.
export {
  childRoute,
  routeName,
  routeModel,
  routeIsStable,
  modelIsStable
} from './ember-internals/common';

// These things are swapped out at build time based on the Ember
// version.
export {
  containingElement,
  initialize,
  getOutletStateTemplate
} from './ember-internals/version-specific';
