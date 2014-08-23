import { initialize } from "vendor/liquid-fire";
import Ember from "ember";

export default {
  name: 'liquid-fire',

  initialize: function(container) {
    initialize(container, container.lookupFactory('transitions:main'));
    if (Ember.testing) {
      Ember.Test.registerWaiter(function(){
        return container.lookup('transitions:map').runningTransitions() === 0;
      });
    }
  }
};
