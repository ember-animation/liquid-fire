/*
  This makes it possible to animate outerHeight and outerWidth with
  Velocity, which is much more convenient for our purposes. Submitted
  to Velocity as PR #485.
*/

import {
  dependencySatisfies,
  macroCondition,
  importSync,
} from '@embroider/macros';

export const Velocity = (() => {
  if (macroCondition(dependencySatisfies('velocity-animate', '*'))) {
    // For FastBoot, Velocity don't exist so we use a noop
    if (typeof FastBoot !== 'undefined') {
      return () => {};
    }

    return importSync('velocity-animate').default;
  } else {
    throw new Error(
      `liquid-fire was unable to detect velocity-animate. Please add to your app.`,
    );
  }
})();

if (typeof FastBoot === 'undefined') {
  const VCSS = Velocity.CSS;

  const augmentDimension = function (name, element) {
    const sides = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

    if (
      VCSS.getPropertyValue(element, 'boxSizing').toString().toLowerCase() ===
      'border-box'
    ) {
      /* in box-sizing mode, the VCSS width / height accessors already give the outerWidth / outerHeight. */
      return 0;
    } else {
      let augment = 0;
      const fields = [
        'padding' + sides[0],
        'padding' + sides[1],
        'border' + sides[0] + 'Width',
        'border' + sides[1] + 'Width',
      ];
      for (let i = 0; i < fields.length; i++) {
        const value = parseFloat(VCSS.getPropertyValue(element, fields[i]));
        if (!isNaN(value)) {
          augment += value;
        }
      }
      return augment;
    }
  };

  const outerDimension = function (name) {
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
