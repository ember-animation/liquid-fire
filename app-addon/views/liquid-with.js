import LiquidOutlet from "./liquid-outlet";
import Ember from "ember";

export default LiquidOutlet.extend({
  liquidUpdate: Ember.observer('boundContext', function(){
    var View = this.container.lookupFactory('view:default');
    var view = View.create({
      templateName: 'liquid-with',
      originalArgs: this.get('originalArgs'),
      boundContext: this.get('boundContext'),
      innerTemplate: this.get('innerTemplate')
    });
    this.set('currentView', view);
  }).on('init')

});
