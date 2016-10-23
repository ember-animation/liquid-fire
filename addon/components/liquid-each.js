import Ember from 'ember';
import layout from '../templates/components/liquid-each';

export default Ember.Component.extend({
  layout,
  tagName: '',
  init() {
    this._super();
    this._entering = null;
    this._leaving = null;
  },
  didReceiveAttrs() {
    this._entering = [];
    this._leaving = [];
    Ember.run.schedule('afterRender', () => {
      console.log(`${this._entering.length} new children, ${this._leaving.length} removed children`);
      this._entering.forEach(component => {
        component.reveal();
      });
    });
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
