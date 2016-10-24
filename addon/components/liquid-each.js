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
    let current = this._current.map(component => ({ component, measurement: component.measure() }));
    current.forEach(({ component, measurement}) => component.lock(measurement));

    Ember.run.schedule('afterRender', () => {
      // Children that reported they were leaving are already out of
      // DOM here, so take them out of our working `current` list.
      current = current.filter(({ component }) => this._leaving.indexOf(component) === -1);

      // Briefly unlock everybody
      current.forEach(({ component }) => component.unlock());
      // so we can measure the final static layout
      current.forEach(entry => { entry.newMeasurement = entry.component.measure(); });
      let inserted = this._entering.map(component => ({ component, measurement: component.measure() }));
      // Then lock everything down
      current.forEach(({ component, measurement }) => component.lock(measurement));
      inserted.forEach(({ component, measurement }) => component.lock(measurement));

      let promises = inserted.map(({ component }) => component.reveal()).concat(
        current.map(({ component, measurement, newMeasurement }) => component.move(measurement, newMeasurement)));

      RSVP.all(promises).then(() => {
        current.forEach(({ component }) => component.unlock());
        inserted.forEach(({ component }) => component.unlock());
        this.finalizeAnimation();
      });
    });
  },

  finalizeAnimation() {
    this._current = this._current.filter(component => this._leaving.indexOf(component) === -1).concat(this._entering);
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
