import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['nav-link'],
  classNameBindings: ['direction'],

  preGlyphicon: computed('direction', 'topic', function(){
    if (this.get('topic') && this.get('direction') === 'back') {
      return 'glyphicon-chevron-left';
    }
  }),

  postGlyphicon: computed('direction', 'topic', function(){
    if (this.get('topic') && this.get('direction') === 'forward') {
      return 'glyphicon-chevron-right';
    }
  })



});
