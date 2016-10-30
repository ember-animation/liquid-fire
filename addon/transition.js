import Ember from 'ember';
import { task, allSettled } from 'ember-concurrenty';

export default Ember.Object.extend({
  init() {
    this._super(arguments);

    // Public properties
    // this.initialMeasurements = [...Measurements]
    // this.finalMeasurements = [...Measurements]
    // this.opts;

  },

  // --- Hooks you can implement ---

  // Both args are instances of Measurement
  starting: task(function * (/*initial, final*/) {
    yield null;
  }),

  // The default implementation here is often fine.
  matchElements(initialList, finalList) {
    return zip(initialList, finalList);
  },

  // --- Public methods ---

  run() {
    let starting = this.get('starting');
    let matched = this.matchElements(this.initialMeasurments.list, this.finalMeasurements.list);
    return allSettled(matched.map(([initial, final]) => {
      return starting.perform(initial, final);
    }));
  }

});

function zip(listA, listB) {
  let output = [];
  for (let i = 0; i < Math.max(listA.length, listB.length); i++) {
    output.push([listA[i], listB[i]]);
  }
  return output;
}
