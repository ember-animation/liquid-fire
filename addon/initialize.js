import Transitions from "./transitions";
import Modals from "./modals";

export function initialize(container) {
  container.register('transitions:map', Transitions);

  ['outlet', 'with', 'if'].forEach(function(viewName) {
    container.injection('view:liquid-' + viewName, 'transitions', 'transitions:map');
  });

  container.register('liquid-modals:main', Modals);
  container.injection('component:liquid-modal', 'owner', 'liquid-modals:main');


  var lwTemplate = container.lookup('template:liquid-with');
  if (lwTemplate) {
    // This is a hack to make outlets work inside liquid-with.
    lwTemplate.isTop = false;
  }
}
