import TransitionMap from "./transition-map";
import Modals from "./modals";

export function initialize(application) {
  application.register('transitions:map', TransitionMap);
  application.inject('component:liquid-versions', 'transitionMap', 'transitions:map');
  application.register('liquid-modals:main', Modals);
  application.inject('component:liquid-modal', 'owner', 'liquid-modals:main');
}
