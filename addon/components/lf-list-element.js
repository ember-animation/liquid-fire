import Ember from 'ember';
import layout from '../templates/components/lf-list-element';
import { componentNodes } from 'liquid-fire/ember-internals';
import $ from 'jquery';
import velocity from 'velocity';
import RSVP from 'rsvp';

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
  move(newMeasurement) {
    // This is a workaround for https://github.com/julianshapiro/velocity/issues/543
    velocity.hook(this.elt, 'translateX', this.x);
    velocity.hook(this.elt, 'translateY', this.y);

    return velocity(this.elt, {
      translateX: [newMeasurement.x, this.x],
      translateY: [newMeasurement.y, this.y]
    }, { duration: 500 });
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
    let promises = [];
    this.list.forEach(m => {
      let newMeasurement = newMeasurements.list.find(entry => entry.elt === m.elt);
      if (newMeasurement) {
        promises.push(m.move(newMeasurement));
      }
    });
    return RSVP.all(promises);
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

  reveal() {
    let promises = [];
    this._forEachElement(elt => {
      promises.push(velocity(elt, { opacity: [1, 0]}, { visibility: 'visible', duration: 500 })
        .then(() => $(elt).css({
          visibility: '',
          opacity: ''
        })));
    });
    return RSVP.all(promises);
  },


  measure() {
    let list = [];
    this._forEachElement(elt => {
      list.push(new Measurement(elt));
    });
    return new Measurements(list);
  }
});
