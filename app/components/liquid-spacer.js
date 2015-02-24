import { measure } from "./liquid-measured";
import Growable from "liquid-fire/growable";
import Ember from "ember";

export default Ember.Component.extend(Growable, {
  enabled: true,
  
  didInsertElement: function() {
    var child = this.$('> div');
    var measurements = measure(child);
    this.$().css({
      overflow: 'hidden',
      width: measurements.width,
      height: measurements.height
    });
  },

  sizeChange: Ember.observer('measurements', function() {
    if (!this.get('enabled')) { return; }
    var elt = this.$();
    if (!elt || !elt[0]) { return; }
    var want = this.get('measurements');
    var have = measure(this.$());
    this.animateGrowth(elt, have, want);
  }),


  
});
