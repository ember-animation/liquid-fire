import Ember from "ember";
import { animate, stop } from "vendor/liquid-fire";

export default Ember.Component.extend({
  classNames: ['liquid-box'],
  duration: 250,
  trackWidth: true,
  trackHeight: true,

  initialSize: function(){
    var elt = this.$();
    var measure = this._childViews[0];
    measure.updateMeasurements();
    elt.css(this.targetDimensions(measure.get('width'), measure.get('height')));
  }.on('didInsertElement'),

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
            { duration: this.get('duration') }
           );
  }
});
