import Modals from "./modals";

export function initialize(application) {
  application.register('liquid-modals:main', Modals);
  application.inject('component:liquid-modal', 'owner', 'liquid-modals:main');
}
