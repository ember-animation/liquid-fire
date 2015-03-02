import { animate, Promise } from "liquid-fire";

export default function scale(opts={}) {
  return Promise.all([
    animate(this.oldElement, {scale: [0, 1]}, opts),
    animate(this.newElement, {scale: [1, 0]}, opts)
  ]);
}
