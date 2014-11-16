import Ember from "ember";

export default {
  name: 'liquid-fire-docs',

  initialize: function(container) {
    // This lets us work with both Ember 1.7 (where 'select' is not
    // registered on the container) and Ember 1.8 (where you get a
    // deprecation warning for not using 'select' from the container).
    if (!container.lookupFactory('view:select')){
      container.register('view:select', Ember.Select);
    }
  }
};
