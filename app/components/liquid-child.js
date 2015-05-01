import Ember from "ember";
export default Ember.Component.extend({
  classNames: ['liquid-child'],

  updateElementVisibility: function() {
    if (this.element) {
      this.element.style.visibility = this.get('visible') ? '' : 'hidden';
    }
  }.on('willInsertElement').observes('visible'),

  tellContainerWeRendered: Ember.on('didInsertElement', function(){
    this.sendAction('didRender', this);
  })
});
