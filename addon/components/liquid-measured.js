import { next, throttle } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import MutationObserver from 'liquid-fire/mutation-observer';
import layout from 'liquid-fire/templates/components/liquid-measured';
import $ from 'jquery';

const WINDOW_RESIZE_THROTTLE_DURATION = 100;

export default Component.extend({
  layout,

  init() {
    this._super(...arguments);
    this._destroyOnUnload = this._destroyOnUnload.bind(this);
  },

  didInsertElement() {
    this._super(...arguments);
    let self = this;

    // This prevents margin collapse
    this.element.style.overflow = 'auto';

    this.didMutate();

    this.observer = new MutationObserver(function (mutations) {
      self.didMutate(mutations);
    });
    this.observer.observe(this.element, {
      attributes: true,
      subtree: true,
      childList: true,
      characterData: true,
    });

    this.windowResizeHandler = this.windowDidResize.bind(this);
    window.addEventListener('resize', this.windowResizeHandler);

    let elt = $(this.element);
    elt.bind('webkitTransitionEnd', function () {
      self.didMutate();
    });
    // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
    window.addEventListener('unload', this._destroyOnUnload);
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('resize', this.windowResizeHandler);
    window.removeEventListener('unload', this._destroyOnUnload);
  },

  transitionMap: service('liquid-fire-transitions'),

  didMutate() {
    // by incrementing the running transitions counter here we prevent
    // tests from falling through the gap between the time they
    // triggered mutation the time we may actually animate in
    // response.
    let tmap = this.transitionMap;
    tmap.incrementRunningTransitions();
    next(this, function () {
      this._didMutate();
      tmap.decrementRunningTransitions();
    });
  },

  windowDidResize() {
    throttle(this, this.didMutate, WINDOW_RESIZE_THROTTLE_DURATION);
  },

  _didMutate() {
    if (!this.element) {
      return;
    }
    let elt = $(this.element);
    this.didMeasure(measure(elt));
  },

  _destroyOnUnload() {
    this.willDestroyElement();
  },
});

export function measure($elt) {
  let boundingRect = $elt[0].getBoundingClientRect();

  // Calculate the scaling.
  // NOTE: We only handle the simple zoom case.
  let claimedWidth = $elt[0].offsetWidth;

  // Round the width because offsetWidth is rounded
  let actualWidth = Math.round(boundingRect.width);
  let scale = actualWidth > 0 ? claimedWidth / actualWidth : 0;

  return {
    width: boundingRect.width * scale,
    height: boundingRect.height * scale,
  };
}
