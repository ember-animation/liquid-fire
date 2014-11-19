import Ember from 'ember';

export default function() {
  Ember.assert(
    "You must provide a transition name as the first argument to scrollThen. Example: this.use('scrollThen', 'toLeft')",
    'string' === typeof arguments[2]
  );

  var el = document.getElementsByTagName('html'),
      transitionArgs = Array.prototype.slice.call(arguments, 0, 2),
      nextTransition = this.lookup(arguments[2]),
      self = this,
      options = arguments[3] || {};

  Ember.assert(
    "The second argument to scrollThen is passed to Velocity's scroll function and must be an object",
    'object' === typeof options
  );

  // set scroll options via: this.use('scrollThen', 'ToLeft', {easing: 'spring'})
  options = Ember.merge({duration: 500, offset: 0}, options);

  // additional args can be passed through after the scroll options object
  // like so: this.use('scrollThen', 'moveOver', {duration: 100}, 'x', -1);
  transitionArgs.push.apply(transitionArgs, Array.prototype.slice.call(arguments, 4));

  return window.$.Velocity(el, 'scroll', options).then(function() {
    nextTransition.apply(self, transitionArgs);
  });
}

