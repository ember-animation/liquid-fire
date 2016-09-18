import Ember from "ember";

export default Ember.Component.extend({
  classNames: ['nav-link'],
  classNameBindings: ['direction'],

  preGlyphicon: Ember.computed('direction', 'topic', function(){
    if (this.get('topic') && this.get('direction') === 'back') {
      return 'glyphicon-chevron-left';
    }
  }),

  postGlyphicon: Ember.computed('direction', 'topic', function(){
    if (this.get('topic') && this.get('direction') === 'forward') {
      return 'glyphicon-chevron-right';
    }
  })



});
