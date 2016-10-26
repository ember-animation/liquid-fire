import Ember from 'ember';
import layout from '../templates/components/animated-each';
import RSVP from 'rsvp';
import matchReplacements from 'liquid-fire/match-replacements';

export default Ember.Component.extend({
  layout,
  tagName: '',
  init() {
    this._super();
    this._entering = [];
    this._current = [];
    this._leaving = [];
    this._prevItems = [];
    this._lockCounter = 0;
  },
  didReceiveAttrs() {
    let prevItems = this._prevItems;
    let items = this.get('items');
    this._prevItems = items.slice();

    let current = this._current.map(component => ({ component, measurements: component.measure(), item: component.item }));
    if (current.length > 0) {
      this._notifyContainer('lock');
    }
    current.forEach(({ measurements }) => measurements.lock());
    this._lockCounter++;

    Ember.run.schedule('afterRender', () => {
      let [kept, removed] = partition(current, entry => this._leaving.indexOf(entry.component) < 0);

      // Briefly unlock everybody
      kept.forEach(({ measurements }) => measurements.unlock());
      // so we can measure the final static layout
      kept.forEach(entry => { entry.newMeasurements = entry.component.measure(); });
      let inserted = this._entering.map(component => ({ component, measurements: component.measure(), item: component.item }));
      let containerMotion = this._notifyContainer('measure');

      // Update our permanent state here before we actualy
      // animate. This leaves us consistent in case we re-enter before
      // the animation finishes.
      this._current = kept.concat(inserted).map(entry => entry.component);
      this._entering = [];
      this._leaving = [];

      // Then lock everything down
      kept.forEach(({ measurements }) => measurements.lock());
      inserted.forEach(({ measurements }) => measurements.lock());
      // Including ghost copies of the deleted components
      removed.forEach(({ measurements }) => {
        measurements.append();
        measurements.lock();
      });

      let replaced;
      [inserted, removed, replaced] = matchReplacements(prevItems, items, inserted, kept, removed);

      let motions = [containerMotion].concat(
        inserted.map(({ measurements }) => measurements.enter()).reduce((a,b) => a.concat(b), []),
        kept.map(({ measurements, newMeasurements }) => measurements.move(newMeasurements)).reduce((a,b) => a.concat(b), []),
        removed.map(({ measurements }) => measurements.exit()).reduce((a,b) => a.concat(b), []),
        replaced.map(([older, newer]) => newer.measurements.replace(older.measurements)).reduce((a,b) => a.concat(b), [])
      );
      RSVP.allSettled(motions.map(m => m.get('_run').perform())).then(() => {
        this._lockCounter--;
        if (this._lockCounter < 1) {
          kept.forEach(({ measurements }) => measurements.unlock());
          inserted.forEach(({ measurements }) => measurements.unlock());
          replaced.forEach(([older, { measurements }]) => measurements.unlock());
          this._notifyContainer('unlock');
        }
      });
    });
  },

  _notifyContainer: function(method) {
    var target = this.get('notify');
    if (target && target[method]) {
      return target[method]();
    }
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
