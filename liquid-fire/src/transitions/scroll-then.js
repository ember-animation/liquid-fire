import { assert } from '@ember/debug';
import isBrowser from '../is-browser';
import { Velocity } from 'liquid-fire';

export default function (nextTransitionName, options, ...rest) {
  if (isBrowser()) {
    assert(
      "You must provide a transition name as the first argument to scrollThen. Example: this.use('scrollThen', 'toLeft')",
      'string' === typeof nextTransitionName
    );

    const el = document.getElementsByTagName('html');
    const nextTransition = this.lookup(nextTransitionName);
    if (!options) {
      options = {};
    }

    assert(
      "The second argument to scrollThen is passed to Velocity's scroll function and must be an object",
      'object' === typeof options
    );

    // set scroll options via: this.use('scrollThen', 'ToLeft', {easing: 'spring'})
    options = { duration: 500, offset: 0, ...options };

    // additional args can be passed through after the scroll options object
    // like so: this.use('scrollThen', 'moveOver', {duration: 100}, 'x', -1);

    return Velocity(el, 'scroll', options).then(() => {
      nextTransition.apply(this, rest);
    });
  }
}
