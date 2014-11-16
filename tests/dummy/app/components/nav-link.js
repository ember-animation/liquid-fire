import Ember from "ember";

export default Ember.Component.extend({
  classNames: ['nav-link'],
  classNameBindings: ['direction'],

  preGlyphicon: function(){
    if (this.get('topic') && this.get('direction') === 'back') {
      return 'glyphicon-chevron-left';
    }
  }.property('direction', 'topic'),

  postGlyphicon: function(){
    if (this.get('topic') && this.get('direction') === 'forward') {
      return 'glyphicon-chevron-right';
    }
  }.property('direction', 'topic')



});
