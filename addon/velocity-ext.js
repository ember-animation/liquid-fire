/*
  This makes it possible to animate outerHeight and outerWidth with
  Velocity, which is much more convenient for our purposes. Submitted
  to Velocity as PR #485.
*/

import Velocity from 'velocity';
if (typeof FastBoot === undefined) {
  let VCSS = Velocity.CSS;

  let augmentDimension = function (name, element) {
    let sides = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

    if (
      VCSS.getPropertyValue(element, 'boxSizing').toString().toLowerCase() ===
      'border-box'
    ) {
      /* in box-sizing mode, the VCSS width / height accessors already give the outerWidth / outerHeight. */
      return 0;
    } else {
      let augment = 0;
      let fields = [
        'padding' + sides[0],
        'padding' + sides[1],
        'border' + sides[0] + 'Width',
        'border' + sides[1] + 'Width',
      ];
      for (let i = 0; i < fields.length; i++) {
        let value = parseFloat(VCSS.getPropertyValue(element, fields[i]));
        if (!isNaN(value)) {
          augment += value;
        }
      }
      return augment;
    }
  };

  let outerDimension = function (name) {
    return function (type, element, propertyValue) {
      switch (type) {
        case 'name':
          return name;
        case 'extract':
          return parseFloat(propertyValue) + augmentDimension(name, element);
        case 'inject':
          return (
            parseFloat(propertyValue) - augmentDimension(name, element) + 'px'
          );
      }
    };
  };

  VCSS.Normalizations.registered.outerWidth = outerDimension('width');
  VCSS.Normalizations.registered.outerHeight = outerDimension('height');
}
