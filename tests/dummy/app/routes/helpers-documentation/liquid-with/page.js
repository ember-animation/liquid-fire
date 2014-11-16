import Ember from "ember";

export default Ember.Route.extend({
  model: function(params) {
    return Ember.Object.create({id: parseInt(params.id)});
  }
});
