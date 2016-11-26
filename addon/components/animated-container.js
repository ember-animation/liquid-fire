import Ember from 'ember';
import layout from '../templates/components/animated-container';
import Resize from '../motions/resize';
import { task } from 'ember-concurrency';
import Sprite from '../sprite';

// TODO: refactor to make reentrant handling possible

export default Ember.Component.extend({
  layout,
  classNames: ['animated-container'],

  init() {
    this._super();
    this.sprite = null;
  },

  animate: task(function * (sprite) {
    let motion = Resize.create(sprite);
    yield motion.run();
  }),

  actions: {
    lock() {
      if (this.sprite) {
        this.sprite.unlock();
      }
      this.sprite = new Sprite(this.element, this);
      this.sprite.measureInitialBounds();
      this.sprite.lockDimensions();
    },
    measure() {
      if (this.sprite) {
        this.sprite.unlock();
        this.sprite.measureFinalBounds();
        this.sprite.lockDimensions();
        return this.get('animate').perform(this.sprite);
      }
    },
    unlock() {
      if (this.sprite) {
        this.sprite.unlock();
        this.sprite = null;
      }
    }
  }
});
