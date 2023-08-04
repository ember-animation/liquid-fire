import { capitalize } from '@ember/string';
import { Velocity } from '../index';

export function measure($elt) {
  const boundingRect = $elt.getBoundingClientRect();

  // Calculate the scaling.
  // NOTE: We only handle the simple zoom case.
  const claimedWidth = $elt.offsetWidth;

  // Round the width because offsetWidth is rounded
  const actualWidth = Math.round(boundingRect.width);
  const scale = actualWidth > 0 ? claimedWidth / actualWidth : 0;

  return {
    width: boundingRect.width * scale,
    height: boundingRect.height * scale,
  };
}

export function animateGrowth(
  elt,
  have,
  want,
  transitionMap,
  growWidth,
  growHeight,
  growEasing,
  shrinkDelay,
  growDelay,
  growDuration,
  growPixelsPerSecond,
) {
  transitionMap.incrementRunningTransitions();
  const adaptations = [];

  if (growWidth) {
    adaptations.push(
      adaptDimension(
        elt,
        'width',
        have,
        want,
        growEasing,
        shrinkDelay,
        growDelay,
        growDuration,
        growPixelsPerSecond,
      ),
    );
  }

  if (growHeight) {
    adaptations.push(
      adaptDimension(
        elt,
        'height',
        have,
        want,
        growEasing,
        shrinkDelay,
        growDelay,
        growDuration,
        growPixelsPerSecond,
      ),
    );
  }

  return Promise.all(adaptations).then(() => {
    transitionMap.decrementRunningTransitions();
  });
}

function adaptDimension(
  elt,
  dimension,
  have,
  want,
  growEasing,
  shrinkDelay,
  growDelay,
  growDuration,
  growPixelsPerSecond,
) {
  if (have[dimension] === want[dimension]) {
    return Promise.resolve();
  }
  const target = {};
  target['outer' + capitalize(dimension)] = [want[dimension], have[dimension]];
  return Velocity(elt, target, {
    delay: delayFor(have[dimension], want[dimension], shrinkDelay, growDelay),
    duration: durationFor(
      have[dimension],
      want[dimension],
      growDuration,
      growPixelsPerSecond,
    ),
    queue: false,
    easing: growEasing,
  });
}

function delayFor(before, after, shrinkDelay, growDelay) {
  if (before > after) {
    return shrinkDelay;
  }

  return growDelay;
}

function durationFor(before, after, growDuration, growPixelsPerSecond) {
  return Math.min(
    growDuration,
    (1000 * Math.abs(before - after)) / growPixelsPerSecond,
  );
}
