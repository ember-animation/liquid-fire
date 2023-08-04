import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { get, action } from '@ember/object';
import { compare } from '@ember/utils';
import { A } from '@ember/array';

let allModels = [
  { id: 1, firstName: 'Tom', lastName: 'Dale' },
  { id: 2, firstName: 'Yehuda', lastName: 'Katz' },
  { id: 3, firstName: 'Leah', lastName: 'Silber' },
  { id: 4, firstName: 'Peter', lastName: 'Wagenet' },
  { id: 5, firstName: 'Robert', lastName: 'Jackson' },
];

export default class ScenariosHeroController extends Controller {
  @tracked showFirst = true;
  @tracked sortBy = ['firstName'];

  @tracked models = A(allModels.slice());

  get sortedModels() {
    return sortBy(this.models, this.sortBy);
  }

  @action
  toggle() {
    this.showFirst = !this.showFirst;
  }

  @action
  toggleSort() {
    this.sortBy = this.sortBy[0] === 'firstName' ? ['lastName'] : ['firstName'];
  }

  @action
  deleteModel(model) {
    this.models.removeObject(model);
  }

  @action
  restoreModels() {
    this.models = allModels.slice();
  }
}

// sort logic taken from ember sortBy
// https://github.com/emberjs/ember.js/blob/v3.28.1/packages/%40ember/-internals/runtime/lib/mixins/array.js#L1416
function sortBy(list, sortKeys) {
  return list.slice().sort((a, b) => {
    for (let i = 0; i < sortKeys.length; i++) {
      const key = sortKeys[i];
      let propA = get(a, key);
      let propB = get(b, key);

      // return 1 or -1 else continue to the next sortKey
      const compareValue = compare(propA, propB);
      if (compareValue) {
        return compareValue;
      }
    }
    return 0;
  });
}
