import TransitionMap from "./transition-map";
import { animate, stop, isAnimating, timeSpent, timeRemaining, finish } from "./animate";
import Promise from "./promise";
import MutationObserver from "./mutation-observer";
import versionWarnings from "./version-warnings";
import "./velocity-ext";
export { default as Pausable } from './mixins/pausable';

versionWarnings({
  minEmberVersion: [1, 11],
  minVelocityVersion: [0, 11, 8]
});


export { TransitionMap, animate, stop, isAnimating, timeSpent, timeRemaining, finish,
         Promise, MutationObserver };
