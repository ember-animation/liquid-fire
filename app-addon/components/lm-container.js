import Ember from "ember";
import "vendor/liquid-fire/tabbable";

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
    this.$().focus();
  },

  // Credit to https://github.com/instructure/ic-modal
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
