export default Ember.Route.extend({
  model: function(params) {
    return {id: params.id};
  }
});
