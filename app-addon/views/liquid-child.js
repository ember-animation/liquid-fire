import Ember from "ember";

export default Ember.ContainerView.extend({
  classNames: ['liquid-child'],
  resolveInsertionPromise: Ember.on('didInsertElement', function(){
    // Children start out hidden and invisible.
    // Measurement will `show` them and Velocity will make them visible.
    // This prevents a flash of pre-animated content.
    this.$().css({visibility: 'hidden'}).hide();
    if (this._resolveInsertion) {
      this._resolveInsertion(this);
    }
  })
});

