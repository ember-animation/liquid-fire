import Ember from "ember";

export default Ember.Controller.extend({
  showDetail: false,
  activeTab: 'toLeft',

  actions: {
    toggleDetail() {
      this.toggleProperty('showDetail');
    },
    changeTab(tabName){
      this.set('activeTab', tabName);
    }
  }
});
