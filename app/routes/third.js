import Ember from "ember";
import Person from "liquid-fire/models/person";

export default Ember.Route.extend({
  model: function(params) {
    return Person.create({id: params.id});
  }
});
