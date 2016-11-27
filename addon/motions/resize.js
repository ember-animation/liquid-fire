import { velocity }  from 'liquid-fire/concurrency-helpers';
import Motion from '../motion';
import { task } from 'ember-concurrency';

export default Motion.extend({
  animate: task(function *() {
    let duration = this.opts.duration;
    if (this.opts.duration == null) {
      duration = 500;
    }
    yield velocity(this.sprite.element, {
      width: [this.sprite.finalBounds.width, this.sprite.initialBounds.width],
      height: [this.sprite.finalBounds.height, this.sprite.initialBounds.height]
    }, { duration });
  })
});
