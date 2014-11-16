import Ember from 'ember';

export default Ember.Controller.extend({
  isExpanded: true,
  actions: {
    toggle: function() {
      this.toggleProperty('isExpanded');
    }
  }
});
