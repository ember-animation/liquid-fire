import Ember from "ember";
export default Ember.Component.extend({
  classNames: ['liquid-child'],

  updateElementVisibility: function() {
    let visible = this.get('visible');
    let $container = this.$();

    if ($container && $container.length) {
      $container.css('visibility', visible ? 'visible' : 'hidden');
    }
  }.on('willInsertElement').observes('visible'),

  tellContainerWeRendered: Ember.on('didInsertElement', function(){
    this.sendAction('didRender', this);
  }),
  onWillDestroy: Ember.on('willDestroyElement', function(){
    this.$().removeData();
  })
});
