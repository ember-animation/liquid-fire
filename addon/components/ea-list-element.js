import Ember from 'ember';
import layout from '../templates/components/ea-list-element';
import { componentNodes } from 'liquid-fire/ember-internals';
import $ from 'jquery';
import Measurement from '../measurement';
import Measurements from '../measurements';

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
