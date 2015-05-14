import Ember from 'ember';
import { Promise } from 'liquid-fire';

export default function(nextTransitionName, options, ...rest) {
  Ember.assert(
    "You must provide a transition name as the first argument to scrollWhile. Example: this.use('scrollWhile', 'toLeft')",
    'string' === typeof nextTransitionName
  );

  var el = document.getElementsByTagName('html');
  var nextTransition = this.lookup(nextTransitionName);
  if (!options) { options = {}; }

  Ember.assert(
    "The second argument to scrollWhile is passed to Velocity's scroll function and must be an object",
    'object' === typeof options
  );

  // set scroll options via: this.use('scrollWhile', 'ToLeft', {easing: 'spring'})
  options = Ember.merge({duration: 500, offset: 0}, options);

  // additional args can be passed through after the scroll options object
  // like so: this.use('scrollWhile', 'moveOver', {duration: 100}, 'x', -1);

  return Promise.all([
    window.$.Velocity(el, 'scroll', options),
    nextTransition.apply(this, rest)
  ]);
};
