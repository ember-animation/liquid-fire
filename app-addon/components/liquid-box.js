import Ember from "ember";
import { animate, stop } from "../libs/liquid-fire";

export default Ember.Component.extend({
  duration: 250,

  initialSize: function(){
    var elt = this.$();
    var child = elt.children().first();
    elt.css({height: child.height(), width: child.width()});
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
