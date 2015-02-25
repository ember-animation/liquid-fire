import TransitionMap from "./transition-map";
import Modals from "./modals";

export function initialize(application) {
  application.register('transitions:map', TransitionMap);

  ['outlet', 'with', 'if'].forEach(function(viewName) {
    application.inject('view:liquid-' + viewName, 'transitions', 'transitions:map');
  });

  application.inject('component:liquid-versions', 'transitions', 'transitions:map');
  application.inject('transition', 'transitions', 'transitions:map');

  application.register('liquid-modals:main', Modals);
  application.inject('component:liquid-modal', 'owner', 'liquid-modals:main');

}
