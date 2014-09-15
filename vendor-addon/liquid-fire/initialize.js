import Transitions from "./transitions";
import Modals from "./modals";
import rules from "./internal-rules";

export default function initialize(container, config) {
  var tm = Transitions.map(config);
  tm.map(rules);
  tm.container = container;
  container.register('transitions:map', tm,
                     {instantiate: false});


  var modals = Modals.create({container: container});
  container.register('liquid-modals:main', modals,
                     {intantiate: false});

  ['outlet', 'with', 'if'].forEach(function(viewName) {
    container.injection('view:liquid-' + viewName, 'transitions', 'transitions:map');
  });
}
