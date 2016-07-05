import Ember from 'ember';
import isBrowser from "liquid-fire/is-browser";

export default function(nextTransitionName, options, ...rest) {
  if (isBrowser()) {
    Ember.assert(
      "You must provide a transition name as the first argument to scrollThen. Example: this.use('scrollThen', 'toLeft')",
      'string' === typeof nextTransitionName
    );

    var el = document.getElementsByTagName('html');
    var nextTransition = this.lookup(nextTransitionName);
    if (!options) {  options = {}; }

    Ember.assert(
      "The second argument to scrollThen is passed to Velocity's scroll function and must be an object",
      'object' === typeof options
    );

    // set scroll options via: this.use('scrollThen', 'ToLeft', {easing: 'spring'})
    options = Ember.merge({duration: 500, offset: 0}, options);

    // additional args can be passed through after the scroll options object
    // like so: this.use('scrollThen', 'moveOver', {duration: 100}, 'x', -1);

    return window.$.Velocity(el, 'scroll', options).then(() => {
      nextTransition.apply(this, rest);
    });
  }
}
