import Ember from 'ember';
import layout from '../templates/components/liquid-each';
import RSVP from 'rsvp';
import { containingElement } from 'liquid-fire/ember-internals';

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
    let current = this._current.map(component => ({ component, measurement: component.measure() }));
    current.forEach(({ component, measurement}) => component.lock(measurement));

    Ember.run.schedule('afterRender', () => {
      let [kept, removed] = partition(current, entry => this._leaving.indexOf(entry.component) < 0);

      // Briefly unlock everybody
      kept.forEach(({ component }) => component.unlock());
      // so we can measure the final static layout
      kept.forEach(entry => { entry.newMeasurement = entry.component.measure(); });
      let inserted = this._entering.map(component => ({ component, measurement: component.measure() }));
      // Then lock everything down
      kept.forEach(({ component, measurement }) => component.lock(measurement));
      inserted.forEach(({ component, measurement }) => component.lock(measurement));
      // Including ghost copies of the deleted components
      let parentElement = $(containingElement(this));
      removed.forEach(({ component, measurement }) => {
        measurement.forEach(({elt, width, height, x, y}) => {
          parentElement.append(elt);
          $(elt).css({
            position: 'absolute',
            top: 0,
            left: 0,
            width: width,
            height: height,
            transform: `translateX(${x}px) translateY(${y}px)`
          });
        });
      });

      let promises = inserted.map(({ component }) => component.reveal()).concat(
        kept.map(({ component, measurement, newMeasurement }) => component.move(measurement, newMeasurement)));

      RSVP.all(promises).then(() => {
        kept.forEach(({ component }) => component.unlock());
        inserted.forEach(({ component }) => component.unlock());
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
