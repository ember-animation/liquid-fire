import Ember from "ember";

export default Ember.Controller.extend({
  actions: {
    higher: function(model){
      this.transitionToRoute('helpers-documentation.liquid-bind-block.page', model.get('id')+1);
    }
  }
});
