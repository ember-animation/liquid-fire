# Changelog

### master

- New feature: it's easier to define symmetric transition rules using
  the "reverse" statement.
  (http://beren:4200/#/helpers/transition-map/choosing-transitions)

### 0.4.1

- Bugfix: liquid-box sometimes measured its content as 0

- Bugfix: liquid-box sometimes animated at initial render

### 0.4.0

- liquid-box now accepts `trackWidth` and `trackHeight` options, see docs.

- Bugfix: added a workaround for an RSVP bug that could cause apps
  using liquid-fire to never see exceptions that happen during
  transitions. (https://github.com/ef4/liquid-fire/issues/28)

- Bugfix: prevent a potential exception when `liquid-measure` measures
  nothing.

### 0.3.0

- Helpers now take a `use` option that lets you provide a transition
  name that they will always use. This covers the simplest cases where
  you don't care about context at all, and lets you avoid cluttering
  your transition map.

- Reorganized the documentation routes to avoid potential
  confusion. Before, we had rules like
  `fromRoute('helpers.liquid-if')` which appears to falsely imply you
  can match directly against helper names.

- Thanks to Alex Matchneer (@machty) and Robert Jackson (@rwjblue) for
  contributing to this release.

### 0.2.0

- We now resolve all named transitions via the container. You can
  place them in app/transitions/my-fancy-animation.js. As a result,
  the use of "define" within the transition map is deprecated.

- Added some new animation primitives for testing the state of running
  animations, and adapted the 'fade' transition to demonstrate how to
  handle interruptions.

- Lots more documentation, which is now essentially complete.

### 0.1.6

- Added standalone packaging.

### 0.1.4

- Pull velocity.js from npm
  ([velocity-animate](https://www.npmjs.org/package/velocity-animate))
  instead of bower. This lets users override the version of
  velocity.js that they're using by depending on it directly.

### 0.1.3

- Moved library code under `vendor` so it will no longer fall under
  your app namespace. Import it like `import { animate } from
  "vendor/liquid-fire"`
