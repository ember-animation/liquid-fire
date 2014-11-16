import Ember from "ember";

export default Ember.ObjectController.extend({
  actions: {
    increment: function(){
      this.transitionToRoute('test-with', parseInt(this.get('model.id'))+1);
    },
    decrement: function(){
      this.transitionToRoute('test-with', parseInt(this.get('model.id'))-1);
    }
  }
});
