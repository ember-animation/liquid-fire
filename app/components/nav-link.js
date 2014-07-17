export default Ember.Component.extend({
  isForward: Ember.computed.equal('direction', 'forward')
});
