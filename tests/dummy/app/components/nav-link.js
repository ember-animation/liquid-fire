import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['page-item'],
  classNameBindings: ['direction'],

  back: computed('direction', 'topic', function(){
    return this.get('topic') && this.get('direction') === 'back';
  }),

  forward: computed('direction', 'topic', function(){
    return this.get('topic') && this.get('direction') === 'forward';
  })
});
