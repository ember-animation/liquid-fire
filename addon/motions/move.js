import { velocity }  from 'liquid-fire/concurrency-helpers';
import Motion from '../motion';
import { task } from 'ember-concurrency';
import { ownTransform } from '../transform';

export default Motion.extend({
  measure() {
    this.transform = ownTransform(this.sprite.element);
  },
  animate: task(function *() {
    let dx = this.sprite.finalBounds.left - this.sprite.initialBounds.left;
    let dy = this.sprite.finalBounds.top - this.sprite.initialBounds.top;

    //-------------------------------------------------------|
    // This is a workaround for https://github.com/julianshapiro/velocity/issues/543
    velocity.hook(this.sprite.element, 'translateX', 0); //|
    velocity.hook(this.sprite.element, 'translateY', 0);   //|
    // ------------------------------------------------------

    let duration = this.opts.duration;
    if (duration == null) {
      duration = 500;
    }
    yield velocity(this.sprite.element, {
      translateX: [dx, 0],
      translateY: [dy, 0]
    }, { duration, begin: () => this.sprite.reveal() });
  })
});
