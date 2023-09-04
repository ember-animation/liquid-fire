import { animate, stop, Promise } from '../index';
export default function flexGrow(opts) {
  stop(this.oldElement);
  return Promise.all([
    animate(this.oldElement, { 'flex-grow': 0 }, opts),
    animate(this.newElement, { 'flex-grow': [1, 0] }, opts),
  ]);
}
