import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { animateGrowth, measure } from '../utils/animate';

export default class LiquidOutletComponent extends Component {
  @service('liquid-fire-transitions') transitionMap;

  element = null;

  get enabled() {
    return this.args.enabled || true;
  }

  get growDuration() {
    return this.args.growDuration || 250;
  }

  get growPixelsPerSecond() {
    return this.args.growPixelsPerSecond || 200;
  }

  get growEasing() {
    return this.args.growEasing || 'slide';
  }

  get shrinkDelay() {
    return this.args.shrinkDelay || 0;
  }

  get growDelay() {
    return this.args.growDelay || 0;
  }

  get growWidth() {
    return this.args.growWidth !== undefined ? this.args.growWidth : true;
  }

  get growHeight() {
    return this.args.growHeight !== undefined ? this.args.growHeight : true;
  }

  @action
  setup(element) {
    this.element = element;

    const elt = element;
    const child = elt.getElementsByTagName('div')[0];
    const measurements = this.myMeasurements(measure(child));

    element.style.overflow = 'hidden';

    if (this.growWidth) {
      elt.style.width = `${measurements.width}px`;
    }
    if (this.growHeight) {
      elt.style.height = `${measurements.height}px`;
    }
  }

  @action
  sizeChanged(measurements) {
    if (!this.enabled) {
      return;
    }
    if (!this.element) {
      return;
    }
    const want = this.myMeasurements(measurements);
    const elt = this.element;
    const have = measure(elt);
    this.animateGrowth(elt, have, want);
  }

  animateGrowth(elt, have, want) {
    return animateGrowth(
      elt,
      have,
      want,
      this.transitionMap,
      this.growWidth,
      this.growHeight,
      this.growEasing,
      this.shrinkDelay,
      this.growDelay,
      this.growDuration,
      this.growPixelsPerSecond,
    );
  }

  // given our child's outerWidth & outerHeight, figure out what our
  // outerWidth & outerHeight should be.
  myMeasurements(childMeasurements) {
    const elt = this.element;
    return {
      width:
        childMeasurements.width +
        sumCSS(elt, padding('width')) +
        sumCSS(elt, border('width')),
      height:
        childMeasurements.height +
        sumCSS(elt, padding('height')) +
        sumCSS(elt, border('height')),
    };
  }
}

function sides(dimension) {
  return dimension === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
}

function padding(dimension) {
  const s = sides(dimension);
  return ['padding' + s[0], 'padding' + s[1]];
}

function border(dimension) {
  const s = sides(dimension);
  return ['border' + s[0] + 'Width', 'border' + s[1] + 'Width'];
}

function sumCSS(elt, fields) {
  let accum = 0;
  const style = getComputedStyle(elt);

  for (let i = 0; i < fields.length; i++) {
    const num = parseFloat(style[fields[i]], 10);
    if (!isNaN(num)) {
      accum += num;
    }
  }
  return accum;
}
