import Component from '@glimmer/component';
import isBrowser from 'liquid-fire/is-browser';

export default class GridOverlayComponent extends Component {
  constructor() {
    super(...arguments);
    if (isBrowser()) {
      document.addEventListener('keydown', function (e) {
        // Ctrl-Alt-g shows vertical rhythm
        if (e.ctrlKey && e.altKey && e.keyCode === 71) {
          toggleGrid(22);
        }
      });
    }
  }
}

function show_lead(space, offset) {
  const max = document.querySelector('body').clientHeight / space;
  hide_lead();
  for (let i = 0; i < max; i++) {
    const element = document.createElement('div');
    element.classList.add('grid');
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
  if (document.querySelector('.grid')) {
    document.querySelectorAll('.grid').forEach((grid) => {
      grid.remove();
    });
  }
}

function toggleGrid(leading, leading_offset) {
  if (!leading_offset) {
    leading_offset = 0;
  }
  if (document.querySelector('#vgrid0')) {
    return hide_lead();
  } else {
    return show_lead(leading, leading_offset);
  }
}
