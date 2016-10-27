import $ from 'jquery';
import Move from 'liquid-fire/motions/move';

export default class Measurement {
  constructor(elt) {
    let bounds = elt.getBoundingClientRect();
    let parentBounds = elt.offsetParent.getBoundingClientRect();
    this.elt = elt;
    this.parentElement = elt.parentElement;
    this.width = bounds.width;
    this.height = bounds.height;
    this.x = bounds.left - parentBounds.left;
    this.y = bounds.top - parentBounds.top;
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
    $(this.elt).css({
      position: '',
      top: '',
      left: '',
      width: '',
      height: '',
      transform: ''
    });
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
