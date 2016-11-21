import $ from 'jquery';

export default class AnimatedElement {
  constructor(elt) {
    let bounds = elt.getBoundingClientRect();
    let parentBounds = elt.offsetParent.getBoundingClientRect();
    this.elt = elt;
    this.parentElement = elt.parentElement;
    this.width = bounds.width;
    this.height = bounds.height;
    this.x = bounds.left - parentBounds.left;
    this.y = bounds.top - parentBounds.top;
    this._styleCache = $(this.elt).attr('style') || null;
  }
  lock() {
    $(this.elt).css({
      position: 'absolute',
      top: 0,
      left: 0,
      width: this.width,
      height: this.height,
      transform: `translateX(${this.x}px) translateY(${this.y}px)`
    });
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
