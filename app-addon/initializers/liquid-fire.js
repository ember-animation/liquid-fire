import { initialize } from "../libs/liquid-fire";
import transitionConfig from "../transitions";

export default {
  name: 'liquid-fire',

  initialize: function(container) {
    initialize(container, transitionConfig);
  }
};
