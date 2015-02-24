import Ember from 'ember';

export default Ember.Controller.extend({
  name: 'Ed',
  actions: {
    submitName: function() {
      this.set('name', this.get('nextName'));
      this.set('nextName', '');
    }
  },
  showBiggerThing: Ember.computed('name', function() {
    return this.get('name') === 'ed';
  })
});
