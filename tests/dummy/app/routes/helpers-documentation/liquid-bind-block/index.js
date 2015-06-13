import Ember from "ember";

export default Ember.Route.extend({
  beforeModel: function(){
    this.transitionTo('helpers-documentation.liquid-bind-block.page', 1);
  }
});
