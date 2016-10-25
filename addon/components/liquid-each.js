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
    this._prevItems = [];
  },
  didReceiveAttrs() {
    let prevItems = this._prevItems;
    let items = this.get('items');
    this._prevItems = items.slice();

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

      // NEXT: Attempt to match replacements here. Replacement happens
      // when we have an enter and a leave, and each has the same
      // relationship in the list to the surrounding kept entries.
      let replaced;
      [inserted, removed, replaced] = matchReplacements(prevItems, items, inserted, kept, removed);

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

export function matchReplacements(prevItems, items, inserted, kept, removed) {
  if (inserted.length === 0 || removed.length === 0) {
    return [inserted, removed, []];
  }

  let outputInserted = [];
  let outputRemoved = removed.slice();
  let outputReplaced = [];

  let keptIndices = {};
  kept.forEach(entry => {
    keptIndices[items.indexOf(entry.component)] = prevItems.indexOf(entry.component);
  });

  let removedIndices = {};
  removed.forEach(entry => {
    removedIndices[prevItems.indexOf(entry.component)] = entry;
  });

  inserted.forEach(entry => {
    let newIndex = items.indexOf(entry.component);
    let cursor = newIndex - 1;
    while (cursor > -1 && keptIndices[cursor] == null) {
      cursor--;
    }
    let matchedRemoval = removedIndices[cursor + 1];
    if (matchedRemoval) {
      outputReplaced.push([matchedRemoval, entry]);
      outputRemoved.splice(outputRemoved.indexOf(matchedRemoval), 1);
    } else {
      outputInserted.push(entry);
    }
  });

  return [outputInserted, outputRemoved, outputReplaced];

}
