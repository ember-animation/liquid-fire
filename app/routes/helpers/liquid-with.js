import Ember from "ember";

export default Ember.Route.extend({
  beforeModel: function(){
    this.transitionTo('helpers.liquid-with.page', 1);
  }
});
