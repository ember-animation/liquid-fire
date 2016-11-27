import $ from 'jquery';
import { ownTransform, Transform } from './transform';

const inFlight = new WeakMap();

export default class Sprite {
  constructor(element, component, asContainer=false) {
    this.component = component;
    this.element = element;
    this._parentElement = element.parentElement;
    if (asContainer) {
      this._imposedStyle = {
        width: element.offsetWidth,
        height: element.offsetHeight
      };
    } else {
      let computedStyle = getComputedStyle(element);
      let { top, left } = offsets(element, computedStyle);
      this._imposedStyle = {
        top: top - parseFloat(computedStyle.marginTop),
        left: left - parseFloat(computedStyle.marginLeft),
        width: element.offsetWidth,
        height: element.offsetHeight,
        position: computedStyle.position === 'fixed' ? 'fixed' : 'absolute'
      };
    }
    let predecessor = inFlight.get(element);
    if (predecessor) {
      // When we finish, we want to be able to set the style back to
      // whatever it was before any Sprites starting locking
      // things.
      this._styleCache = predecessor._styleCache;
    } else {
      this._styleCache = $(element).attr('style') || null;
    }
    this.initialBounds = null;
    this.finalBounds = null;
    this.transform = ownTransform(element);
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
  translate(dx, dy) {
    let t = this.transform.mult(new Transform(1, 0, 0, 1, dx, dy));
    this.transform = t;
    $(this.element).css('transform', t.serialize());
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

function offsets(element, elementComputedStyle) {
  let offsetParent = element.offsetParent;
  let effectiveOffsetParent = getEffectiveOffsetParent(element);
  let cursor = element.parentElement;

  let dx = 0;
  let dy = 0;

  if (effectiveOffsetParent !== offsetParent && elementComputedStyle.position !== 'absolute') {
    let outerBounds = offsetParent.getBoundingClientRect();
    let innerBounds = effectiveOffsetParent.getBoundingClientRect();
    let t = ownTransform(effectiveOffsetParent);
    dy = outerBounds.top - innerBounds.top + t.ty;
    dx = outerBounds.left - innerBounds.left + t.tx;
  }

  let c = getComputedStyle(cursor);
  dy -= parseFloat(c.borderTopWidth);
  dx -= parseFloat(c.borderLeftWidth);

  return {
    top: element.offsetTop + dy,
    left: element.offsetLeft + dx
  };
}

// This compensates for the fact that browsers are inconsistent in the
// way they report offsetLeft & offsetTop for elements with a
// transformed ancestor beneath their nearest positioned ancestor.
function getEffectiveOffsetParent(element) {
  let offsetParent = element.offsetParent;
  let cursor = element.parentElement;
  while (cursor && offsetParent && cursor !== offsetParent) {
    if ($(cursor).css('transform') !== 'none') {
      return cursor;
    }
    cursor = cursor.parentElement;
  }
  return offsetParent;
}
