import Ember from "ember";
import { animate, stop } from "vendor/liquid-fire";

export default Ember.Component.extend({
  classNames: ['liquid-box'],
  duration: 250,

  initialSize: function(){
    var elt = this.$();
    var measure = this._childViews[0];
    measure.updateMeasurements();
    elt.css({height: measure.get('height'), width: measure.get('width')});
  }.on('didInsertElement'),

  resize: Ember.observer('contentHeight', 'contentWidth', function() {
    Ember.run.debounce(this, '_resize', 100);
  }),


  _resize: function() {
    stop(this);
    animate(this,
            { width: this.get('contentWidth'), height: this.get('contentHeight') },
            { duration: this.get('duration') }
           );
  }
});
