import TransitionMap from './transition-map';
import {
  animate,
  stop,
  isAnimating,
  timeSpent,
  timeRemaining,
  finish,
} from './animate';
import Promise from './promise';
import MutationObserver from './mutation-observer';
import {
  dependencySatisfies,
  macroCondition,
  importSync,
} from '@embroider/macros';

const Velocity = (() => {
  if (macroCondition(dependencySatisfies('velocity-animate', '*'))) {
    return importSync('velocity-animate').default;
  } else {
    throw new Error(
      `liquid-fire was unable to detect velocity-animate. Please add to your app.`,
    );
  }
})();

export {
  TransitionMap,
  animate,
  stop,
  isAnimating,
  timeSpent,
  timeRemaining,
  finish,
  Promise,
  MutationObserver,
  Velocity,
};
