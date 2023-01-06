/* jshint newcap: false */
import { inject as service } from '@ember/service';

import Mixin from '@ember/object/mixin';
import { capitalize } from '@ember/string';
import Promise from 'liquid-fire/promise';
import Velocity from 'velocity';

export default Mixin.create({
  growDuration: 250,
  growPixelsPerSecond: 200,
  growEasing: 'slide',
  shrinkDelay: 0,
  growDelay: 0,
  growWidth: true,
  growHeight: true,

  transitionMap: service('liquid-fire-transitions'),

  animateGrowth(elt, have, want) {
    this.transitionMap.incrementRunningTransitions();
    let adaptations = [];

    if (this.growWidth) {
      adaptations.push(this._adaptDimension(elt, 'width', have, want));
    }

    if (this.growHeight) {
      adaptations.push(this._adaptDimension(elt, 'height', have, want));
    }

    return Promise.all(adaptations).then(() => {
      this.transitionMap.decrementRunningTransitions();
    });
  },

  _adaptDimension(elt, dimension, have, want) {
    if (have[dimension] === want[dimension]) {
      return Promise.resolve();
    }
    let target = {};
    target['outer' + capitalize(dimension)] = [
      want[dimension],
      have[dimension],
    ];
    return Velocity(elt, target, {
      delay: this._delayFor(have[dimension], want[dimension]),
      duration: this._durationFor(have[dimension], want[dimension]),
      queue: false,
      easing: this.growEasing || this.constructor.prototype.growEasing,
    });
  },

  _delayFor(before, after) {
    if (before > after) {
      return this.shrinkDelay || this.constructor.prototype.shrinkDelay;
    }

    return this.growDelay || this.constructor.prototype.growDelay;
  },

  _durationFor(before, after) {
    return Math.min(
      this.growDuration || this.constructor.prototype.growDuration,
      (1000 * Math.abs(before - after)) /
        (this.growPixelsPerSecond ||
          this.constructor.prototype.growPixelsPerSecond)
    );
  },
});
