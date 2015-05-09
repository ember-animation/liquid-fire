import Ember from "ember";

export default Ember.Mixin.create({
  activate: function(){
    this._super();
    if (!Ember.testing) {
      window.scrollTo(0,0);
    }
  }
});
