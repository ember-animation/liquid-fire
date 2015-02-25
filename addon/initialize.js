import TransitionMap from "./transition-map";
import Modals from "./modals";

export function initialize(application) {
  application.register('transitions:map', TransitionMap);

  ['outlet', 'with', 'if'].forEach(function(viewName) {
    application.inject('view:liquid-' + viewName, 'transitionMap', 'transitions:map');
  });

  application.inject('component:liquid-versions', 'transitionMap', 'transitions:map');

  application.register('liquid-modals:main', Modals);
  application.inject('component:liquid-modal', 'owner', 'liquid-modals:main');

}
