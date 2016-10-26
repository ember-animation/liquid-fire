import { velocity }  from 'liquid-fire/concurrency-helpers';
import Motion from '../motion';
import { task } from 'ember-concurrency';

export default Motion.extend({
  starting: task(function *() {
    //-------------------------------------------------------|
    // This is a workaround for https://github.com/julianshapiro/velocity/issues/543
    velocity.hook(this.element, 'translateX', this.initial.x); //|
    velocity.hook(this.element, 'translateY', this.final.y);   //|
    // ------------------------------------------------------

    let duration = this.opts.duration;
    if (this.opts.duration == null) {
      duration = 500;
    }

    yield velocity(this.element, {
      translateX: [this.final.x, this.initial.x],
      translateY: [this.final.y, this.initial.y]
    }, { duration, visibility: '' });
  })
});
