import Ember from "ember";
export default Ember.Component.extend({
  classNames: ['liquid-child'],

  updateElementVisibility: Ember.on('willInsertElement', Ember.observer('visible', function() {
    let visible = this.get('visible');
    let $container = this.$();

    if ($container && $container.length) {
      $container.css('visibility', visible ? 'visible' : 'hidden');
    }
  })),

  tellContainerWeRendered: Ember.on('didInsertElement', function(){
    this.sendAction('didRender', this);
  })
});
