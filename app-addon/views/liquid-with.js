import LiquidOutlet from "./liquid-outlet";
import Ember from "ember";

export default LiquidOutlet.extend({
  liquidUpdate: Ember.observer('boundContext', function(){
    var view = Ember._MetamorphView.create({
      container: this.container,
      templateName: 'liquid-with',
      boundContext: this.get('boundContext'),
      liquidWithParent: this,
      liquidContext: this.get('boundContext'),
      hasLiquidContext: true,
    });
    this.set('currentView', view);
  }).on('init')

});
