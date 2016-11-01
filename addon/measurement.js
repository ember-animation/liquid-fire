import $ from 'jquery';
import Move from 'liquid-fire/motions/move';

export default class Measurement {
  constructor(elt) {
    this.elt = elt;
    this.parentElement = elt.parentElement;
    this.width = elt.offsetWidth;
    this.height = elt.offsetHeight;
    this.x = elt.offsetLeft;
    this.y = elt.offsetTop;
    this._styleCache = $(elt).attr('style') || null;
  }
  lock() {
    $(this.elt).css({
      position: 'absolute',
      boxSizing: 'border-box',
      top: this.y,
      left: this.x,
      width: this.width,
      height: this.height
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
  move(newMeasurement) {
    return Move.create({
      element: this.elt,
      initial: { x: this.x, y: this.y },
      final: { x: newMeasurement.x, y: newMeasurement.y },
      opts: { duration: 500 }
    }).run();
  }
  enter() {
    return Move.create({
      element: this.elt,
      initial: { x: '100vw', y: this.y },
      final: { x: this.x, y: this.y },
      opts: { duration: 1000 }
    }).run();
  }
  exit() {
    return Move.create({
      element: this.elt,
      initial: { x: this.x, y: this.y },
      final: { x: '100vw', y: this.y },
      opts: { duration: 1000 }
    }).run();
  }
}
