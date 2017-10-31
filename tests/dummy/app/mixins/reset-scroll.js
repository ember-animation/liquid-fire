import Ember from "ember";

export default Ember.Mixin.create({
  fastboot: Ember.inject.service(),
  activate: function(){
    this._super();
    if (!Ember.testing && !this.get('fastboot.isFastBoot')) {
      window.scrollTo(0,0);
    }
  }
});
