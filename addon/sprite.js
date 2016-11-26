import $ from 'jquery';

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
    this._styleCache = $(this.element).attr('style') || null;
    this.initialBounds = element.getBoundingClientRect();
    this.finalBounds = null;
  }
  measureFinalBounds() {
    this.finalBounds = this.element.getBoundingClientRect();
  }
  lock() {
    $(this.element).css(this._imposedStyle);
  }
  unlock() {
    if (this._styleCache) {
      $(this.element).attr('style', this._styleCache);
    } else {
      this.element.attributes.removeNamedItem('style');
    }
  }
  reveal() {
    $(this.element).css({
      visibility: ''
    });
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
