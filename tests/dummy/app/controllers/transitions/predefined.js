import Controller from '@ember/controller';

export default Controller.extend({
  showDetail: false,
  activeTab: 'toLeft',

  actions: {
    toggleDetail() {
      this.toggleProperty('showDetail');
    },
    changeTab(tabName) {
      this.set('activeTab', tabName);
    },
  },
});
