import Transitions from "./transitions";

export default function initialize(container, config) {
  container.register('transitions:map',
                     Transitions.map(config),
                     {instantiate: false});
  ['outlet', 'with', 'if'].forEach(function(viewName) {
    container.injection('view:liquid-' + viewName, 'transitions', 'transitions:map');
  });
}
