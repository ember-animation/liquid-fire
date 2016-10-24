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
      let [kept, removed] = this.partition(current);

      // Briefly unlock everybody
      kept.forEach(({ component }) => component.unlock());
      // so we can measure the final static layout
      kept.forEach(entry => { entry.newMeasurement = entry.component.measure(); });
      let inserted = this._entering.map(component => ({ component, measurement: component.measure() }));
      // Then lock everything down
      kept.forEach(({ component, measurement }) => component.lock(measurement));
      inserted.forEach(({ component, measurement }) => component.lock(measurement));
      // Including ghost copies of the deleted components
      removed.forEach(({ component, measurement, copies, parentElement }) => {
        measurement.forEach((entry, index) => {
          $(parentElement).append(copies[index]);
          $(copies[index]).css({
            position: 'absolute',
            top: 0,
            left: 0,
            width: measurement.width,
            height: measurement.height,
            transform: `translateX(${measurement.x}px) translateY(${measurement.y}px)`
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

  partition(currentMeasurements) {
    let kept = [];
    let removed = [];
    let leavingComponents = this._leaving.map(entry => entry.component);

    currentMeasurements.forEach(entry => {
      let index = leavingComponents.indexOf(entry.component);
      if (index < 0) {
        kept.push(entry);
      } else {
        this._leaving[index].measurement = entry.measurement;
        removed.push(this._leaving[index]);
      }
    });
    return [kept, removed];
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
    childLeaving(component, copies, parentElement) {
      this._leaving.push({component, copies, parentElement});
    }
  }

}).reopenClass({
  positionalParams: ['items']
});
