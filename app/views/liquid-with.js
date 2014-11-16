import LiquidOutlet from "./liquid-outlet";
import Ember from "ember";

export default LiquidOutlet.extend({
  liquidUpdate: Ember.on('init', Ember.observer('boundContext', function(){
    var context = this.get('boundContext');
    if (Ember.isEmpty(context)) {
      this.set('currentView', null);
      return;
    }
    var view = Ember._MetamorphView.create({
      container: this.container,
      templateName: 'liquid-with',
      boundContext: context,
      liquidWithParent: this,
      liquidContext: context,
      hasLiquidContext: true,
    });
    this.set('currentView', view);
  }))

});
