import Ember from "ember";

var allModels = Ember.A([
  { id: 1, firstName: 'Tom', lastName: 'Dale' },
  { id: 2, firstName: 'Yehuda', lastName: 'Katz' },
  { id: 3, firstName: 'Leah', lastName: 'Silber' },
  { id: 4, firstName: 'Peter', lastName: 'Wagenet' },
  { id: 5, firstName: 'Robert', lastName: 'Jackson' }
]);


export default Ember.Controller.extend({
  needs: ['application'],
  showFirst: true,

  sortBy: 'firstName',

  models: allModels.slice(),

  sortedModels: Ember.computed('models.[]', 'sortBy', function() {
    var m = this.get('models').slice();
    return m.sortBy(this.get('sortBy'));
  }),

  actions: {
    toggle: function () {
      this.set('showFirst', !this.get('showFirst'));
    },
    toggleSort: function() {
      this.set('sortBy', this.get('sortBy') === 'firstName' ? 'lastName' : 'firstName');
    },
    deleteModel: function(model) {
      this.get('models').removeObject(model);
    },
    restoreModels: function() {
      this.set('models', allModels.slice());
    }
  }
});
