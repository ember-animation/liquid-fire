import Ember from 'ember';
import layout from '../templates/components/lf-list-element';
import { componentNodes } from 'liquid-fire/ember-internals';
import $ from 'jquery';
import velocity from 'velocity';

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
        fn($(node));
      } else if (! /^\s*$/.test(node.textContent)) {
        console.warn("Found bare text content inside a liquid-each");
      }
      if (node === lastNode){ break; }
      node = node.nextSibling;
    }
  },

  reveal() {
    this._forEachElement(elt => {
      velocity(elt, { opacity: [1, 0]}, { visibility: 'visible', duration: 500 })
        .then(() => $(elt).css({
          visibility: '',
          opacity: ''
        }));
    });
  }
});
