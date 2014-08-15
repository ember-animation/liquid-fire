import Ember from "ember";
import { animate, stop } from "vendor/liquid-fire";

export default Ember.Component.extend({
  classNames: ['liquid-box'],
  duration: 250,
  trackWidth: true,
  trackHeight: true,
  _enabled: false,

  initialSize: function(){
    var elt = this.$();
    var measure = this._childViews[0];
    measure.updateMeasurements();
    elt.css(this.targetDimensions(measure.get('width'), measure.get('height')));
    Ember.run.later(this, 'enable', this.get('duration'));
  }.on('didInsertElement'),

  // This causes us to absorb any size changes that happen during the
  // first `duration` after insertion without animating them.
  enable: function(){
    this.set('_enabled', true);
  },

  resize: Ember.observer('contentHeight', 'contentWidth', function() {
    Ember.run.debounce(this, '_resize', 100);
  }),


  targetDimensions: function(measuredWidth, measuredHeight) {
    var dim = {};
    if (this.get('trackWidth')) {
      dim.width = measuredWidth;
    }
    if (this.get('trackHeight')) {
      dim.height = measuredHeight;
    }
    return dim;
  },

  _resize: function() {
    stop(this);
    animate(this,
            this.targetDimensions(this.get('contentWidth'), this.get('contentHeight')),
            { duration: this.get('_enabled') ? this.get('duration') : 0}
           );
  }
});
