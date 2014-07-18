import Ember from "ember";

export default Ember.ObjectController.extend({
  actions: {
    higher: function(){
      var model = this.get('model');
      this.transitionToRoute('helpers.liquid-with.page', model.get('id')+1);
    }
  }
});
