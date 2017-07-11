import Ember from 'ember';

export default function(ms, opts, ...rest) {
  opts = opts !== undefined ? opts : {};

  return new Ember.RSVP.Promise(resolve => {
    setTimeout(() => {
      resolve(this.lookup(opts.then || 'default').call(this, ...rest));
    }, ms);
  });
}
