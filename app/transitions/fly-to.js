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
    height: this.newElement.height(),
    backgroundColor: hexColor(this.newElement.css('background-color'))
  };

  this.newElement.css({ visibility: 'hidden' });
  return animate(this.oldElement, motion, opts).then(() => {
    this.newElement.css({ visibility: ''});
  });
}

function hexColor(rgbColor) {
  return '#' +
    /(\d+)[^\d]+(\d+)[^\d]+(\d+)/.exec(rgbColor).slice(1).map(
      (c) => ('0' + parseInt(c, 10).toString(16)).slice(-2)
    ).join('');
}
