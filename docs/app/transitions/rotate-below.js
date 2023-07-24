// BEGIN-SNIPPET rotate-below
import { stop, animate, Promise } from 'liquid-fire';

export default function rotateBelow(opts = {}) {
  let direction = 1;
  if (opts.direction === 'cw') {
    direction = -1;
  }
  stop(this.oldElement);
  if (this.oldElement) {
    this.oldElement.style.transformOrigin = '50% 150%';
  }
  if (this.newElement) {
    this.newElement.style.transformOrigin = '50% 150%';
  }
  return Promise.all([
    animate(this.oldElement, { rotateZ: -90 * direction + 'deg' }, opts),
    animate(
      this.newElement,
      { rotateZ: ['0deg', 90 * direction + 'deg'] },
      opts
    ),
  ]);
}
// END-SNIPPET
