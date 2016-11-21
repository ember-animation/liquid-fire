import $ from 'jquery';

export default class AnimatedElement {
  constructor(elt) {
    this.elt = elt;
    this.parentElement = elt.parentElement;
    let computedStyle = getComputedStyle(elt);
    this._imposedStyle = {
      top: elt.offsetTop - parseFloat(computedStyle.marginTop),
      left: elt.offsetLeft - parseFloat(computedStyle.marginLeft),
      width: elt.offsetWidth,
      height: elt.offsetHeight,
      position: 'absolute'
    };
    this._styleCache = $(this.elt).attr('style') || null;
  }
  lock() {
    $(this.elt).css(this._imposedStyle);
  }
  unlock() {
    if (this._styleCache) {
      $(this.elt).attr('style', this._styleCache);
    } else {
      this.elt.attributes.removeNamedItem('style');
    }
  }
  reveal() {
    $(this.elt).css({
      visibility: ''
    });
  }
  append() {
    $(this.parentElement).append(this.elt);
  }
  remove() {
    if (this.elt.parentNode) {
      this.elt.parentNode.removeChild(this.elt);
    }
  }
}
