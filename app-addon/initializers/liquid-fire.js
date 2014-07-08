import { Transitions } from "../libs/liquid-fire";
import transitionConfig from "../transitions";

export function configure(container, config) {
  container.register('transitions:map',
                     Transitions.map(config),
                     {instantiate: false});
  container.injection('view:liquid-outlet', 'transitions', 'transitions:map');
  container.injection('view:liquid-with', 'transitions', 'transitions:map');
}

export default {
  name: 'liquid-fire',

  initialize: function(container) {
    configure(container, transitionConfig);
  }
};
