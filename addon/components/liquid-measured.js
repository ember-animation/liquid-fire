import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import MutationObserver from "liquid-fire/mutation-observer";
import layout from "liquid-fire/templates/components/liquid-measured";

export default Component.extend({
  layout,

  init() {
    this._super(...arguments);
    this._destroyOnUnload = this._destroyOnUnload.bind(this);
  },

  didInsertElement() {
    let self = this;

    // This prevents margin collapse
    this.$().css({
      overflow: 'auto'
    });

    this.didMutate();

    this.observer = new MutationObserver(function(mutations) { self.didMutate(mutations); });
    this.observer.observe(this.get('element'), {
      attributes: true,
      subtree: true,
      childList: true,
      characterData: true
    });
    this.$().bind('webkitTransitionEnd', function() { self.didMutate(); });
    // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
    window.addEventListener('unload', this._destroyOnUnload);
  },

  willDestroyElement() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('unload', this._destroyOnUnload);
  },

  transitionMap: service('liquid-fire-transitions'),

  didMutate() {
    // by incrementing the running transitions counter here we prevent
    // tests from falling through the gap between the time they
    // triggered mutation the time we may actually animate in
    // response.
    let tmap = this.get('transitionMap');
    tmap.incrementRunningTransitions();
    next(this, function() {
      this._didMutate();
      tmap.decrementRunningTransitions();
    });
  },

  _didMutate() {
    let elt = this.$();
    if (!elt || !elt[0]) { return; }
    this.set('measurements', measure(elt));
  },

  _destroyOnUnload() {
    this.willDestroyElement();
  }
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
    height: boundingRect.height * scale
  };
}
