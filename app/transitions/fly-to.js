import { animate, Promise } from "liquid-fire";

export default function flyTo(opts={}) {
  if (!this.newElement) {
    return Promise.resolve();
  } else if (!this.oldElement) {
    this.newElement.css({visibility: ''});
    return Promise.resolve();
  }

  var oldOffset = this.oldElement.offset();
  var newOffset = this.newElement.offset();

  var motion = {
    translateX: newOffset.left - oldOffset.left,
    translateY: newOffset.top - oldOffset.top,
    width: this.newElement.width(),
    height: this.newElement.height()
  };

  this.newElement.css({ visibility: 'hidden' });
  return animate(this.oldElement, motion, opts).then(() => {
    this.newElement.css({ visibility: ''});
  });
}
