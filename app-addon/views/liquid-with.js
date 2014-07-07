import LiquidOutlet from "./liquid-outlet";
import Ember from "ember";

export default LiquidOutlet.extend({
  liquidUpdate: Ember.observer('boundContext', function(){
    var View = this.container.lookupFactory('view:default');
    var view = View.create({
      templateName: 'liquid-with',
      boundContext: this.get('boundContext'),
      liquidWithParent: this
    });
    this.set('currentView', view);
  }).on('init')

});
