import Ember from 'ember';
import layout from '../templates/components/liquid-each';
import RSVP from 'rsvp';

export default Ember.Component.extend({
  layout,
  tagName: '',
  init() {
    this._super();
    this._entering = [];
    this._current = [];
    this._leaving = [];
  },
  didReceiveAttrs() {
    let current = this._current.map(component => ({ component, measurements: component.measure() }));
    current.forEach(({ measurements }) => measurements.lock());

    Ember.run.schedule('afterRender', () => {
      let [kept, removed] = partition(current, entry => this._leaving.indexOf(entry.component) < 0);

      // Briefly unlock everybody
      kept.forEach(({ measurements }) => measurements.unlock());
      // so we can measure the final static layout
      kept.forEach(entry => { entry.newMeasurements = entry.component.measure(); });
      let inserted = this._entering.map(component => ({ component, measurements: component.measure() }));
      // Then lock everything down
      kept.forEach(({ measurements }) => measurements.lock());
      inserted.forEach(({ measurements }) => measurements.lock());
      // Including ghost copies of the deleted components
      removed.forEach(({ measurements }) => {
        measurements.append();
        measurements.lock();
      });

      let promises = inserted.map(({ measurements }) => measurements.enter()).concat(
        kept.map(({ measurements, newMeasurements }) => measurements.move(newMeasurements))
      ).concat(
          removed.map(({ measurements }) => {
            return measurements.exit();
          })
        );

      RSVP.all(promises).then(() => {
        kept.forEach(({ measurements }) => measurements.unlock());
        inserted.forEach(({ measurements }) => measurements.unlock());
        this.finalizeAnimation(kept, inserted);
      });
    });
  },

  finalizeAnimation(kept, inserted) {
    this._current = kept.concat(inserted).map(entry => entry.component);
    this._entering = [];
    this._leaving = [];
  },

  actions: {
    childEntering(component) {
      this._entering.push(component);
    },
    childLeaving(component) {
      this._leaving.push(component);
    }
  }

}).reopenClass({
  positionalParams: ['items']
});


function partition(list, pred) {
  let matched = [];
  let unmatched = [];
  list.forEach(entry => {
    if (pred(entry)) {
      matched.push(entry);
    } else {
      unmatched.push(entry);
    }
  });
  return [matched, unmatched];
}
