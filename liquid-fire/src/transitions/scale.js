import { animate } from '../index';

export default function scale(opts = {}) {
  return animate(this.oldElement, { scale: [0.2, 1] }, opts).then(() => {
    return animate(this.newElement, { scale: [1, 0.2] }, opts);
  });
}
