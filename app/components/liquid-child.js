import Ember from "ember";
export default Ember.Component.extend({
  classNames: ['liquid-child'],
  attributeBindings: ['style'],
  style: Ember.computed('visible', function() {
    return this.get('visible') ? '' : 'visibility:hidden';
  }),
  tellContainerWeRendered: Ember.on('didInsertElement', function(){
    this.sendAction('didRender', this);
  })
});
