import Ember from "ember";

export default Ember.ContainerView.extend({
  classNames: ['liquid-child'],
  resolveInsertionPromise: function(){
    // Children start out hidden. Animations should reveal them. This
    // prevents a flash of pre-animated content.
    this.$().hide();
    if (this._resolveInsertion) {
      this._resolveInsertion(this);
    }
  }.on('didInsertElement')
});

