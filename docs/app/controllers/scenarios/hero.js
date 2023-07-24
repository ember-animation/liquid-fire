import { sort } from '@ember/object/computed';
import Controller from '@ember/controller';
import { A } from '@ember/array';

let allModels = A([
  { id: 1, firstName: 'Tom', lastName: 'Dale' },
  { id: 2, firstName: 'Yehuda', lastName: 'Katz' },
  { id: 3, firstName: 'Leah', lastName: 'Silber' },
  { id: 4, firstName: 'Peter', lastName: 'Wagenet' },
  { id: 5, firstName: 'Robert', lastName: 'Jackson' },
]);

export default Controller.extend({
  showFirst: true,

  sortBy: Object.freeze(['firstName']),

  models: allModels.slice(),

  sortedModels: sort('models.[]', 'sortBy'),

  actions: {
    toggle: function () {
      this.set('showFirst', !this.showFirst);
    },
    toggleSort: function () {
      this.set(
        'sortBy',
        this.sortBy[0] === 'firstName' ? ['lastName'] : ['firstName']
      );
    },
    deleteModel: function (model) {
      this.models.removeObject(model);
    },
    restoreModels: function () {
      this.set('models', allModels.slice());
    },
  },
});
