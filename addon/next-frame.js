import Promise from "./promise";

let raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || rafPolyfill;
let timeLast = 0;

// A promise-wrapped, polyfill-capable version of requestAnimationFrame
export default function(fn) {
  return new Promise(function(resolve, reject) {
    raf(function(timestamp) {
      try {
        resolve(fn(timestamp));
      } catch(err) {
        reject(err);
      }
    });
  });
}

function rafPolyfill(callback) {
  let timeCurrent = (new Date()).getTime();
  let timeDelta;
  timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
  timeLast = timeCurrent + timeDelta;
  return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
}
