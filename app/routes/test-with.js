import Ember from "ember";

export default Ember.Route.extend({
  model: function(params){
    var Person = this.container.lookupFactory('model:person');
    return Person.create({id: params.id});
  }
});
