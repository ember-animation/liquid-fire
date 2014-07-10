import { Transitions } from "../libs/liquid-fire";
import transitionConfig from "../transitions";

export function configure(container, config) {
  container.register('transitions:map',
                     Transitions.map(config),
                     {instantiate: false});
  ['outlet', 'with', 'if'].forEach(function(viewName) {
    container.injection('view:liquid-' + viewName, 'transitions', 'transitions:map');
  });
}

export default {
  name: 'liquid-fire',

  initialize: function(container) {
    configure(container, transitionConfig);
  }
};
