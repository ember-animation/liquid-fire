import { animate, Promise } from "liquid-fire";
import Ember from 'ember';

export default function flyTo(opts={}) {
  if (!this.newElement) {
    return Promise.resolve();
  } else if (!this.oldElement) {
    this.newElement.css({visibility: ''});
    return Promise.resolve();
  }

  var oldOffset = this.oldElement.offset();
  var newOffset = this.newElement.offset();

  if (opts.movingSide === 'new') {
    let motion = withMutations({
      translateX: [0, oldOffset.left - newOffset.left],
      translateY: [0, oldOffset.top - newOffset.top],
      outerWidth: [this.newElement.outerWidth(), this.oldElement.outerWidth()],
      outerHeight: [this.newElement.outerHeight(), this.oldElement.outerHeight()]
    }, this, opts.mutate);
    this.oldElement.css({ visibility: 'hidden' });
    return animate(this.newElement, motion, opts);
  } else if (opts.movingSide === 'both') {
    let newMotion = withMutations({
      translateX: [0, oldOffset.left - newOffset.left],
      translateY: [0, oldOffset.top - newOffset.top],
      outerWidth: [this.newElement.outerWidth(), this.oldElement.outerWidth()],
      outerHeight: [this.newElement.outerHeight(), this.oldElement.outerHeight()],
      opacity: [1, 0]
    }, this, opts.mutate);
    let oldMotion = withMutations({
      translateX: newOffset.left - oldOffset.left,
      translateY: newOffset.top - oldOffset.top,
      outerWidth: this.newElement.outerWidth(),
      outerHeight: this.newElement.outerHeight(),
      opacity: [0, 1]
    }, this, opts.mutate);
    return Promise.all([
      animate(this.newElement, newMotion, opts),
      animate(this.oldElement, oldMotion, opts)
    ]);
  } else {
    let motion = withMutations({
      translateX: newOffset.left - oldOffset.left,
      translateY: newOffset.top - oldOffset.top,
      outerWidth: this.newElement.outerWidth(),
      outerHeight: this.newElement.outerHeight()
    }, this, opts.mutate);
    this.newElement.css({ visibility: 'hidden' });
    return animate(this.oldElement, motion, opts).then(() => {
      this.newElement.css({ visibility: ''});
    });
  }
}

function withMutations(motion, context, properties) {
  if (!properties) {
    return motion;
  }
  for (let property of properties) {
    let camelProp = Ember.String.camelize(property);
    if (/color/.test(property)) {
      let newColor = parseColor(context.newElement.css(property));
      let oldColor = parseColor(context.oldElement.css(property));
      if (newColor.opacity === 0) {
        newColor.hex = oldColor.hex;
      }
      if (oldColor.opacity === 0) {
        oldColor.hex = newColor.hex;
      }
      motion[camelProp] = [newColor.hex, oldColor.hex];
      motion[camelProp + 'Alpha'] = [newColor.opacity, oldColor.opacity];
    } else if ('font-weight' === 'property') {
      let newValue = context.newElement.css(property).replace('bold', 700).replace('normal', 400);
      let oldValue = context.oldElement.css(property).replace('bold', 700).replace('normal', 400);
      if (newValue !== oldValue) {
        motion[camelProp] = [newValue, oldValue];
      }
    } else {
      let newValue = context.newElement.css(property);
      let oldValue = context.oldElement.css(property);
      if (newValue !== oldValue) {
        motion[camelProp] = [newValue, oldValue];
      }
    }
  }
  return motion;
}

let rgbPattern = /^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+))?\)/;
let hexPattern = /^#\d+/;

function parseColor(value) {
  if (hexPattern.test(value)) {
    return { hex: value, opacity: 1 };
  }
  let m = rgbPattern.exec(value);
  if (!m) {
    return { hex: value, opacity: 1 };
  }
  return {
    hex: '#' + m.slice(1, -1).map(component => {
      let chars = parseInt((component || 0), 10).toString(16);
      if (chars.length === 1) {
        chars = '0' + chars;
      }
      return chars;
    }).join(''),
    opacity: parseInt((m[4] || '1'), 10)
  };
}
