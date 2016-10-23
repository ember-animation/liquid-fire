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
    let positions = this._current.map(component => component.measure());
    this._current.forEach((component, index) => component.lock(positions[index]));

    Ember.run.schedule('afterRender', () => {
      // Briefly unlock everybody, so we can measure the final static layout
      this._current.forEach(component => component.unlock());
      let movedPositions = this._current.map(component => component.measure());
      let insertedPositions = this._entering.map(component => component.measure());
      this._current.forEach((component, index) => component.lock(positions[index]));
      this._entering.forEach((component, index) => component.lock(insertedPositions[index]));

      let promises = this._entering.map(component => component.reveal()).concat(
        this._current.map((component, index) => component.move(positions[index], movedPositions[index])));

      RSVP.all(promises).then(() => {
        this._current.forEach(component => component.unlock());
        this._entering.forEach(component => component.unlock());
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
