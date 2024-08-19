import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { measure, animateGrowth } from '../utils/animate';
import './liquid-container.css';

export default class LiquidContainerComponent extends Component {
  @service('liquid-fire-transitions') transitionMap;

  _wasInserted = false;
  element = null;
  _didSetup = false;

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

  setup = modifier((element) => {
    if (this._didSetup) {
      return;
    }

    this._didSetup = true;

    this.element = element;
    this._wasInserted = true;
  });

  @action
  willTransition(versions) {
    if (!this._wasInserted) {
      return;
    }

    // Remember our own size before anything changes
    this._cachedSize = measure(this.element);

    // And make any children absolutely positioned with fixed sizes.
    for (let i = 0; i < versions.length; i++) {
      goAbsolute(versions[i]);
    }
  }

  @action
  afterChildInsertion(versions) {
    const elt = this.element;
    const enableGrowth = this.args.enableGrowth !== false;

    // Measure children
    const sizes = [];
    for (let i = 0; i < versions.length; i++) {
      if (versions[i].view) {
        sizes[i] = measure(versions[i].view.element);
      }
    }

    // Measure ourself again to see how big the new children make
    // us.
    const want = measure(elt);
    const have = this._cachedSize || want;

    // Make ourself absolute
    if (enableGrowth) {
      this.lockSize(elt, have);
    } else {
      this.lockSize(elt, {
        height: Math.max(want.height, have.height),
        width: Math.max(want.width, have.width),
      });
    }

    // Apply '.liquid-animating' to liquid-container allowing
    // any customizable CSS control while an animating is occuring
    this.updateAnimatingClass(true);

    // Make the children absolute and fixed size.
    for (let i = 0; i < versions.length; i++) {
      goAbsolute(versions[i], sizes[i]);
    }

    // Kick off our growth animation
    if (enableGrowth) {
      this._scaling = this.animateGrowth(elt, have, want);
    }
  }

  @action
  afterTransition(versions) {
    for (let i = 0; i < versions.length; i++) {
      goStatic(versions[i]);
    }
    this.unlockSize();
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

  lockSize(elt, want) {
    elt.style.width = `${want.width}px`;
    elt.style.height = `${want.height}px`;
  }

  unlockSize() {
    const doUnlock = () => {
      this.updateAnimatingClass(false);
      if (this.element) {
        this.element.style.width = '';
        this.element.style.height = '';
      }
    };
    if (this._scaling) {
      this._scaling.then(doUnlock);
    } else {
      doUnlock();
    }
  }

  // We're doing this manually instead of via classNameBindings
  // because it depends on upward-data-flow, which generates warnings
  // under Glimmer.
  updateAnimatingClass(on) {
    if (this.isDestroyed) {
      return;
    }
    if (on) {
      this.element.classList.add('liquid-animating');
    } else {
      this.element.classList.remove('liquid-animating');
    }
  }
}

function goAbsolute(version, size) {
  if (!version.view) {
    return;
  }
  const elt = version.view.element;
  const pos = {
    top: elt.offsetTop,
    left: elt.offsetLeft,
  };
  if (!size) {
    size = measure(elt);
  }
  elt.style.width = `${size.width}px`;
  elt.style.height = `${size.height}px`;
  elt.style.position = 'absolute';
  elt.style.top = `${pos.top}px`;
  elt.style.left = `${pos.left}px`;
}

function goStatic(version) {
  if (version.view && !version.view.isDestroyed) {
    const elt = version.view.element;
    elt.style.width = '';
    elt.style.height = '';
    elt.style.position = '';
  }
}
