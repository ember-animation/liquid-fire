import $ from 'jquery';

const inFlight = new WeakMap();

export default class Sprite {
  constructor(element, component) {
    this.component = component;
    this.element = element;
    this._parentElement = element.parentElement;
    let computedStyle = getComputedStyle(element);
    this._imposedStyle = {
      top: element.offsetTop - parseFloat(computedStyle.marginTop),
      left: element.offsetLeft - parseFloat(computedStyle.marginLeft),
      width: element.offsetWidth,
      height: element.offsetHeight,
      position: computedStyle.position === 'fixed' ? 'fixed' : 'absolute'
    };
    let predecessor = inFlight.get(element);
    if (predecessor) {
      // When we finish, we want to be able to set the style back to
      // whatever it was before any Sprites starting locking
      // things.
      this._styleCache = predecessor._styleCache;
    } else {
      this._styleCache = $(this.element).attr('style') || null;
    }
    this.initialBounds = null;
    this.finalBounds = null;
  }
  measureInitialBounds() {
    this.initialBounds = this.element.getBoundingClientRect();
  }
  measureFinalBounds() {
    this.finalBounds = this.element.getBoundingClientRect();
  }
  lock() {
    $(this.element).css(this._imposedStyle);
    inFlight.set(this.element, this);
  }
  lockDimensions() {
    $(this.element).css({
      width: this._imposedStyle.width,
      height: this._imposedStyle.height
    });
    inFlight.set(this.element, this);
  }
  unlock() {
    if (inFlight.get(this.element) === this) {
      inFlight.delete(this.element);
      if (this._styleCache) {
        $(this.element).attr('style', this._styleCache);
      } else {
        this.element.attributes.removeNamedItem('style');
      }
    }
  }
  reveal() {
    $(this.element).removeClass('ember-animated-hidden');
  }
  append() {
    $(this._parentElement).append(this.element);
  }
  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
