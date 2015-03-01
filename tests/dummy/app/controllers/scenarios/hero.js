import Ember from "ember";
export default Ember.Controller.extend({
  needs: ['application'],
  actions: {
    toggle: function () {
      if (this.get('controllers.application.currentRouteName') === 'scenarios.hero.index') {
        this.transitionToRoute('scenarios.hero.second');
      } else {
        this.transitionToRoute('scenarios.hero.index');
      }
    }
  }
});
