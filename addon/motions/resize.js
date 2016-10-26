import { velocity }  from 'liquid-fire/concurrency-helpers';
import Motion from '../motion';
import { task } from 'ember-concurrency';

export default Motion.extend({
  starting: task(function *() {
    let duration = this.opts.duration;
    if (this.opts.duration == null) {
      duration = 500;
    }
    yield velocity(this.element, {
      width: [this.final.width, this.initial.width],
      height: [this.final.height, this.initial.height]
    }, { duration, visibility: '' });
  })
});
