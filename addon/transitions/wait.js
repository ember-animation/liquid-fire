import { Promise as EmberPromise } from 'rsvp';

export default function (ms, opts, ...rest) {
  opts = opts !== undefined ? opts : {};

  return new EmberPromise((resolve) => {
    setTimeout(() => {
      resolve(this.lookup(opts.then || 'default').call(this, ...rest));
    }, ms);
  });
}
