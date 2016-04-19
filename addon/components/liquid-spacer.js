import { measure } from "./liquid-measured";
import Growable from "liquid-fire/growable";
import Ember from "ember";
import layout from "liquid-fire/templates/components/liquid-spacer";

export default Ember.Component.extend(Growable, {
  layout,
  enabled: true,

  didInsertElement: function() {
    var child = this.$('> div');
    var measurements = this.myMeasurements(measure(child));
    var elt = this.$();
    elt.css('overflow', 'hidden');
    if (this.get('growWidth')) {
      elt.outerWidth(measurements.width);
    }
    if (this.get('growHeight')) {
      elt.outerHeight(measurements.height);
    }
  },

  sizeChange: Ember.observer('measurements', function() {
    if (!this.get('enabled')) { return; }
    var elt = this.$();
    if (!elt || !elt[0]) { return; }
    var want = this.myMeasurements(this.get('measurements'));
    var have = measure(this.$());
    this.animateGrowth(elt, have, want);
  }),

  // given our child's outerWidth & outerHeight, figure out what our
  // outerWidth & outerHeight should be.
  myMeasurements: function(childMeasurements) {
    var elt = this.$();
    return {
      width: childMeasurements.width + sumCSS(elt, padding('width')) + sumCSS(elt, border('width')),
      height: childMeasurements.height + sumCSS(elt, padding('height')) + sumCSS(elt, border('height'))
    };
    //if (this.$().css('box-sizing') === 'border-box') {
  }

});

function sides(dimension) {
  return dimension === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
}

function padding(dimension) {
  var s = sides(dimension);
  return ['padding'+s[0], 'padding'+s[1]];
}

function border(dimension) {
  var s = sides(dimension);
  return ['border'+s[0]+'Width', 'border'+s[1]+'Width'];
}

function sumCSS(elt, fields) {
  var accum = 0;
  for (var i=0; i < fields.length; i++) {
    var num = parseFloat(elt.css(fields[i]), 10);
    if (!isNaN(num)) {
      accum += num;
    }
  }
  return accum;
}
