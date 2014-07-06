import Ember from "ember";

export default Ember.ContainerView.extend({
  classNames: ['liquid-child'],
  resolveInsertionPromise: function(){
    if (this._resolveInsertion) {
      this._resolveInsertion(this);
    }
  }.on('didInsertElement')
});

