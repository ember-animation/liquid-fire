// BEGIN-SNIPPET fade-definition
import { isAnimating, finish, timeSpent, animate, stop } from "liquid-fire";
export default function fade(opts={}) {
  var firstStep;
  var outOpts = opts;

  if (isAnimating(this.oldElement, 'fade-out')) {
    // if the old view is already fading out, let it finish.
    firstStep = finish(this.oldElement, 'fade-out');
  } else {
    if (isAnimating(this.oldElement, 'fade-in')) {
      // if the old view is partially faded in, scale its fade-out
      // duration appropriately.
      outOpts = { duration: timeSpent(this.oldElement, 'fade-in') };
    }
    stop(this.oldElement);
    firstStep = animate(this.oldElement, {opacity: 0}, outOpts, 'fade-out');
  }

  return firstStep.then(() => {
    return animate(this.newElement, {opacity: [(opts.maxOpacity || 1), 0]}, opts, 'fade-in');
  });
}
// END-SNIPPET
