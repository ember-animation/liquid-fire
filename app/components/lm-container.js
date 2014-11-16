/*
   Parts of this file were adapted from ic-modal

   https://github.com/instructure/ic-modal
   Released under The MIT License (MIT)
   Copyright (c) 2014 Instructure, Inc.
*/

import Ember from "ember";
import "liquid-fire/tabbable";

/**
 * If you do something to move focus outside of the browser (like
 * command+l to go to the address bar) and then tab back into the
 * window, capture it and focus the first tabbable element in an active
 * modal.
 */
var lastOpenedModal = null;
Ember.$(document).on('focusin', handleTabIntoBrowser);

function handleTabIntoBrowser() {
  if (lastOpenedModal) {
    lastOpenedModal.focus();
  }
}


export default Ember.Component.extend({
  classNames: ['lm-container'],
  attributeBindings: ['tabindex'],
  tabindex: 0,

  keyUp: function(event) {
    // Escape key
    if (event.keyCode === 27) {
      this.sendAction();
    }
  },

  keyDown: function(event) {
    // Tab key
    if (event.keyCode === 9) {
      this.constrainTabNavigation(event);
    }
  },

  didInsertElement: function() {
    this.focus();
    lastOpenedModal = this;
  },

  willDestroy: function() {
    lastOpenedModal = null;
  },

  focus: function() {
    if (this.get('element').contains(document.activeElement)) {
      // just let it be if we already contain the activeElement
      return;
    }
    var target = this.$('[autofocus]');
    if (!target.length) {
      target = this.$(':tabbable');
    }

    if (!target.length) {
      target = this.$();
    }

    target[0].focus();
  },

  constrainTabNavigation: function(event) {
    var tabbable = this.$(':tabbable');
    var finalTabbable = tabbable[event.shiftKey ? 'first' : 'last']()[0];
    var leavingFinalTabbable = (
      finalTabbable === document.activeElement ||
        // handle immediate shift+tab after opening with mouse
        this.get('element') === document.activeElement
    );
    if (!leavingFinalTabbable) { return; }
    event.preventDefault();
    tabbable[event.shiftKey ? 'last' : 'first']()[0].focus();
  }
});
