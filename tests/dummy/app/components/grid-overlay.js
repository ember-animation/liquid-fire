import Component from '@ember/component';

function show_lead(space, offset) {
  let max = document.querySelector('body').clientHeight / space;
  hide_lead();
  for (let i = 0; i < max; i++) {
    const element = document.createElement('div');
    element.class = 'grid';
    element.id = `vgrid${i}`;
    const body = document.querySelector('body');
    body.appendChild(element);
    css(document.querySelector('#vgrid' + i), {
      height: '' + space + 'px',
      width: '100%',
      position: 'absolute',
      top: '' + (space * i - 1 + offset) + 'px',
      left: '0px',
      borderTop: '1px solid black',
      zIndex: 2000,
      'pointer-events': 'none',
      opacity: 0.2,
      'background-color': 'transparent',
    });
  }
}

function css(element, styles) {
  for (const property in styles) {
    element.style[property] = styles[property];
  }
}

function hide_lead() {
  document.querySelector('.grid').remove();
}

function toggleGrid(leading, leading_offset) {
  if (leading_offset == null) {
    leading_offset = 0;
  }
  if (document.querySelector('#vgrid0')) {
    return hide_lead();
  } else {
    return show_lead(leading, leading_offset);
  }
}

export default Component.extend({
  didInsertElement: function () {
    this._super(...arguments);
    document.addEventListener('keydown', function (e) {
      // Ctrl-Alt-g shows vertical rhythm
      if (e.ctrlKey && e.altKey && e.keyCode === 71) {
        toggleGrid(22);
      }
    });
  },
});
