import Ember from 'ember';
import layout from '../templates/components/ea-list-element';
import { componentNodes } from 'liquid-fire/ember-internals';
import $ from 'jquery';
import Move from 'liquid-fire/motions/move';

class Measurement {
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

class Measurements {
  constructor(list) {
    this.list = list;
  }
  lock() {
    this.list.forEach(m => m.lock());
  }
  unlock() {
    this.list.forEach(m => m.unlock());
  }
  append() {
    this.list.forEach(m => m.append());
  }
  move(newMeasurements) {
    let motions = [];
    this.list.forEach(m => {
      let newMeasurement = newMeasurements.list.find(entry => entry.elt === m.elt);
      if (newMeasurement) {
        motions.push(m.move(newMeasurement));
      }
    });
    return motions;
  }
  enter() {
    return this.list.map(m => m.enter());
  }
  exit() {
    return this.list.map(m => m.exit());
  }
  replace(otherMeasurements) {
    return otherMeasurements.exit().concat(this.enter());
  }
}

export default Ember.Component.extend({
  layout,
  tagName: '',
  didInsertElement() {
    this._forEachElement(elt => {
      $(elt).css('visibility', 'hidden');
    });
    this.sendAction("entering", this);
  },
  willDestroyElement() {
    this.sendAction("leaving", this);
  },

  _forEachElement(fn) {
    let { firstNode, lastNode } = componentNodes(this);
    let node = firstNode;
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        fn(node);
      } else if (! /^\s*$/.test(node.textContent)) {
        console.warn("Found bare text content inside a liquid-each");
      }
      if (node === lastNode){ break; }
      node = node.nextSibling;
    }
  },

  measure() {
    let list = [];
    this._forEachElement(elt => {
      list.push(new Measurement(elt));
    });
    return new Measurements(list);
  }
});
