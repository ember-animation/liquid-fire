import { animate, stop } from "liquid-fire";

// arguments are passed directly from use statements in transition rules, e.g.
// this.use('myTransition', arg1, arg2)

export default function (/* arg1, arg2 */) {
  // Stop any currently running animation on oldElement
  stop(this.oldElement);

  // Fade out the old element
  return animate(this.oldElement, { opacity: 0 })
    // And then fade in the new element, from opacity 0 to 1
    .then( () =>
      animate(this.newElement, { opacity: [1, 0] })
    );
}
