import { next, throttle } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { bind } from '@ember/runloop';
import Component from '@glimmer/component';
import { MutationObserver } from '../index';
import { action } from '@ember/object';
import { measure } from '../utils/animate';

const WINDOW_RESIZE_THROTTLE_DURATION = 100;

export default class LiquidMeasuredComponent extends Component {
  constructor() {
    super(...arguments);

    // this._destroyOnUnload = bind(this, this._destroyOnUnload);
  }

  @action
  setup(element) {
    this.element = element;

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

    this.windowResizeHandler = bind(this, this.windowDidResize);
    window.addEventListener('resize', this.windowResizeHandler);

    this.element.addEventListener('webkitTransitionEnd', function () {
      self.didMutate();
    });
    // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
    // window.addEventListener('unload', this._destroyOnUnload);
  }

  @action
  destroyElement() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('resize', this.windowResizeHandler);
    // window.removeEventListener('unload', this._destroyOnUnload);
  }

  @service('liquid-fire-transitions') transitionMap;

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
  }

  windowDidResize() {
    throttle(this, this.didMutate, WINDOW_RESIZE_THROTTLE_DURATION);
  }

  _didMutate() {
    if (!this.element) {
      return;
    }
    this.args.didMeasure(measure(this.element));
  }

  // _destroyOnUnload() {
  //   this.willDestroyElement();
  // }
}
