import $ from 'jquery';

export default class AnimatedElement {
  constructor(elt) {
    this._elt = elt;
    this._parentElement = elt.parentElement;
    let computedStyle = getComputedStyle(elt);
    this._imposedStyle = {
      top: elt.offsetTop - parseFloat(computedStyle.marginTop),
      left: elt.offsetLeft - parseFloat(computedStyle.marginLeft),
      width: elt.offsetWidth,
      height: elt.offsetHeight,
      position: computedStyle.position === 'fixed' ? 'fixed' : 'absolute'
    };
    this._styleCache = $(this._elt).attr('style') || null;
  }
  get element() {
    return this._elt;
  }
  lock() {
    $(this._elt).css(this._imposedStyle);
  }
  unlock() {
    if (this._styleCache) {
      $(this._elt).attr('style', this._styleCache);
    } else {
      this._elt.attributes.removeNamedItem('style');
    }
  }
  reveal() {
    $(this._elt).css({
      visibility: ''
    });
  }
  append() {
    $(this._parentElement).append(this._elt);
  }
  remove() {
    if (this._elt.parentNode) {
      this._elt.parentNode.removeChild(this._elt);
    }
  }
}
