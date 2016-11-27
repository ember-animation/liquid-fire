import { velocity }  from 'liquid-fire/concurrency-helpers';
import Motion from '../motion';
import { task } from 'ember-concurrency';
import { ownTransform } from '../transform';

export default Motion.extend({
  animate: task(function *() {
    let tx = this.sprite.transform.tx;
    let ty = this.sprite.transform.ty;
    let dx = this.sprite.finalBounds.left - this.sprite.initialBounds.left;
    let dy = this.sprite.finalBounds.top - this.sprite.initialBounds.top;

    //-------------------------------------------------------|
    // This is a workaround for https://github.com/julianshapiro/velocity/issues/543
    velocity.hook(this.sprite.element, 'translateX', tx); //|
    velocity.hook(this.sprite.element, 'translateY', ty);   //|
    // ------------------------------------------------------

    let duration = this.opts.duration;
    if (duration == null) {
      duration = 500;
    }
    yield velocity(this.sprite.element, {
      translateX: [tx+dx, tx],
      translateY: [ty+dy, ty]
    }, { duration, begin: () => this.sprite.reveal() });
  })
});
