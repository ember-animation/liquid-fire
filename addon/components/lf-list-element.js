import Ember from 'ember';
import layout from '../templates/components/lf-list-element';
import { componentNodes } from 'liquid-fire/ember-internals';
import $ from 'jquery';
import velocity from 'velocity';
import RSVP from 'rsvp';

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
    let measurements = [];
    this._forEachElement(elt => {
      let bounds = elt.getBoundingClientRect();
      let parentBounds = elt.offsetParent.getBoundingClientRect();
      measurements.push({
        elt,
        width: bounds.width,
        height: bounds.height,
        x: bounds.left - parentBounds.left,
        y: bounds.top - parentBounds.top
      });
    });
    return measurements;
  },

  lock(measurements) {
    measurements.forEach(({elt, width, height, x, y}) => {
      $(elt).css({
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        transform: `translateX(${x}px) translateY(${y}px)`
      });
    });
  },

  unlock() {
    this._forEachElement(elt => {
      $(elt).css({
        position: '',
        top: '',
        left: '',
        width: '',
        height: '',
        transform: ''
      });
    });
  },

  move(oldMeasurements, newMeasurements) {
    let promises = [];
    this._forEachElement(elt => {
      let oldMeasurement = oldMeasurements.find(m => m.elt === elt);
      let newMeasurement = newMeasurements.find(m => m.elt === elt);

      // This is a workaround for https://github.com/julianshapiro/velocity/issues/543
      velocity.hook(elt, 'translateX', oldMeasurement.x);
      velocity.hook(elt, 'translateY', oldMeasurement.y);

      promises.push(velocity(elt, {
        translateX: [newMeasurement.x, oldMeasurement.x],
        translateY: [newMeasurement.y, oldMeasurement.y]
      }, { duration: 500 }));
    });
    return RSVP.all(promises);
  }
});
