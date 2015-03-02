import Ember from "ember";
export default Ember.Controller.extend({
  needs: ['application'],
  showFirst: true,
  actions: {
    toggle: function () {
      this.set('showFirst', !this.get('showFirst'));
    }
  }
});
