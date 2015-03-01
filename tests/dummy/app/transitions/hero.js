import { animate, Promise } from "liquid-fire";

function hexColor(rgbColor) {
  return '#' +
    /(\d+)[^\d]+(\d+)[^\d]+(\d+)/.exec(rgbColor).slice(1).map(
      (c) => ('0' + parseInt(c, 10).toString(16)).slice(-2)
    ).join('');
}

export default function() {
  var blue = this.oldElement.find('.bluebox');
  var red = this.newElement.find('.redbox');

  var blueOffset = blue.offset();
  var redOffset = red.offset();

  var blueMotion = {
    translateX: redOffset.left - blueOffset.left,
    translateY: redOffset.top - blueOffset.top,
    width: red.width(),
    height: red.height(),
    backgroundColor: hexColor(red.css('background-color'))
  };

  var newBlue = blue.clone();
  blue.css({visibility: 'hidden'});
  blue = newBlue;
  blue.appendTo(this.newElement.parent());
  blue.offset(blueOffset);
  red.css({ visibility: 'hidden' });

  var duration = 500;

  return Promise.all([
    animate(blue, blueMotion, { duration: duration }),
    animate(this.newElement, { opacity: [1, 0] }, { duration: duration }),
    animate(this.oldElement, { opacity: [0, 1] }, { duration: duration }),
  ]).then(function() {
    red.css({ visibility: ''});
    blue.remove();
  });
}
