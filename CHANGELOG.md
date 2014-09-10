# Changelog

### 0.8.4

- Oops, released before pushing upstream. Fixing.

### 0.8.3

- Enhancement: add `liquid-unless` view to complement `liquid-if`.

### 0.8.2

- Bugfix: fix a regression that causes some directional transitions to
  collapse padding (#60).

- Bugfix: the liquid-with helper now respects enableGrowth,
  growDuration, growPixelsPerSecond, and growEasing. 

### 0.8.1

- Bugfix: my first attempt at resolving issue #53 was wrong, so 0.8.0
  can suffer jittery outlets. 

### 0.8.0

- Possibly BREAKING change: improved management of container sizes
  thanks to @jamesreggio. This should result in much more friendly
  behavior for things like inline content or content centered with
  auto margins.

- Enhancement: the predefined directional transitions (toLeft, toUp,
  etc), have a new implementation that should look nicer when the old
  & new content vary widely in size.

- Bugfix: we no longer depend on a global `$` and always defer to `Ember.$`.

### 0.7.1

- Bugfix: don't conflict with a user's transition map written in any
  transpiled language.

- Bugfix: pass 'id' property through helpers so you can.

### 0.7.0

- Feature: all helpers accept `growDuration` to cap the amount of time
  they'll spend growing/shrinking.

- Feature: the library will warn you if you're using Velocity older
  than 0.11.8, because we're using an enhancement in that version to
  better deal with element `position` properties.

### 0.6.3

- BREAKING bugfix: all helpers render with a `liquid-container` class,
  rather than `liquid-outlet` class. This was the original intent of
  the 0.6.0 release and the docs already reflected this, but it was
  left out until now.

### 0.6.2

- Enhancement: make Ember integration tests automatically wait for our
  animations to finish.

- Test coverage: added acceptance tests for all the demo animations.

### 0.6.1

- Oops, released the wrong branch. Fixing.

### 0.6.0

- BREAKING CHANGES: this release introduces static layout. No longer
  do you need to deal with all the liquid-child divs being absolutely
  positioned.

- liquid-box (and liquid-measure) are deprecated. The point of
  liquid-box was mostly to work around the problem of absolutely
  positioned children, which is not a problem anymore.

- all the other helpers gain the ability to animate their own height
  and width changes to match their changing content.

- all helpers now produce two layers of divs instead of just one. The
  outer layer (liquid-container) will remain stable in your document
  flow (and possibly animate its own size changes, as mentioned
  above). The inner layer is the liquid-child that animations target.

- liquid-child has no default styling, and it can be statically
  positioned. The library will dynamically switch it to absolutely
  positioned only during animations.

- New DSL shorthand: you can say `toModel(true)` as an easy way to
  match a liquid-if going into the `true` state, etc. 

### 0.5.0

- New feature: it's easier to define symmetric transition rules using
  the "reverse" statement.
  (http://beren:4200/#/helpers/transition-map/choosing-transitions)

- Improvement: the toLeft/toRight/toUp/toDown predefined transitions
  should look nicer when they get interrupted.

- Ember Compat: we now support metal-views!

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
