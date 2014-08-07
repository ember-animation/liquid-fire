import { initialize } from "vendor/liquid-fire";

export default {
  name: 'liquid-fire',

  initialize: function(container) {
    initialize(container, container.lookupFactory('transitions:main'));
  }
};
