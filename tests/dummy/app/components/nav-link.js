import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['page-item'],
  classNameBindings: ['direction'],

  back: computed('direction', 'topic', function () {
    return this.topic && this.direction === 'back';
  }),

  forward: computed('direction', 'topic', function () {
    return this.topic && this.direction === 'forward';
  }),
});
