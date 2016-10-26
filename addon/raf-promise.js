import RSVP from 'rsvp';

// This is a requestAnimationFrame polyfill, wrapped in a cancelable
// Promise interface that's designed to resolve via the microtask
// queue (like real spec-compliant Promises are supposed to). This
// lets us use rAF within ember-concurrency correctly. RSVP promises
// within Ember do not resolve on the microtask queue, because Ember
// schedules them inside backburner.

let Promise;
if (window.Promise) {
  Promise = window.Promise;
} else {
  console.warn("Unable to achieve proper rAF timing on this browser, microtask-based Promise implementation needed.");
  Promise = RSVP.Promise;
}

export default function() {

  if (typeof requestAnimationFrame === 'undefined') {
    // If we don't have a real requestAnimationFrame, we just try to
    // run at 60hz
    let timer;
    let promise = new Promise(resolve => {
      timer = setTimeout(resolve, 17);  // 17ms is 60hz
    });
    promise.__ec_cancel__ = () => {
      clearTimeout(timer);
    };
    return promise;
  } else {
    let frame;
    let promise = new Promise(resolve => {
      frame = requestAnimationFrame(resolve);
    });
    promise.__ec_cancel__ = () => {
      cancelAnimationFrame(frame);
    };
    return promise;
  }
}
