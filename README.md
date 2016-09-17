Liquid Fire
===========
[![Build Status](https://travis-ci.org/ember-animation/liquid-fire.svg?branch=master)](https://travis-ci.org/ember-animation/liquid-fire)

Comprehensive animation support for ambitious Ember applications. [Interactive Documentation is here](http://ember-animation.github.io/liquid-fire/).

## Features

- Animated transitions between routes that work seamlessly with the
  Ember router.

- A DSL for laying out your spatial route relationships, cleanly
  separated from view-layer implementation details.

- Animated transitions between models within a single route.

- Animated transitions between individual scalar values within a
  template.

- Promise-driven API to control your animation flow.

- Backed by velocity.js, but easy to extend to other animation drivers
  if there's interest.


## Ember Compatibility Table

We support a wide range of Ember versions, but you must choose the
correct version of liquid-fire:

| Ember Version    | Liquid Fire Branch   | Liquid Fire Release  |
| -----------------|----------------------| ---------------------|
| 1.8 through 1.10 | oldstable            | 0.17.x               |
| 1.11 through 1.12| stable               | 0.19.x               |
| 1.13 and beyond  | master               | latest               |

`stable` and `oldstable` branches still receive bugfixes and PRs are
welcome, but new feature work happens on `master`.

## Installation

This is an ember-cli addon, so all you need is an npm install.
For Ember 1.13 or newer, use:

    ember install liquid-fire

For older ember versions, consult the compatibility table above to pick the right liquid-fire version and then install with one of these:

    ember install liquid-fire@^0.17.0
    ember install liquid-fire@^0.19.0


### Documentation

[Liquid Fire website](http://ember-animation.github.io/liquid-fire) is an ember-cli application that contains an
interactive demo & documentation. It runs from Liquid Fire's [test dummy app](https://github.com/ember-animation/liquid-fire/tree/master/tests/dummy/app).

You can also see some examples in my [Ember Animation Demo](http://github.com/ef4/ember-animation-demo) repo, and this [video presentation from the Boston Ember Meetup](https://www.youtube.com/watch?v=S4M78SO3gAc).

## Development

### Source Organization

This repo contains both the liquid-fire library and a demo application
that presents interactive documentation. It follows standard ember-cli
addon format.

 - app: is code that's loaded directly into the user's application
 - addon: is code that can be imported by the user from the `liquid-fire` namespace
 - tests/dummy: is the testing, demo, and documentation application

### Selecting Ember Versions

Liquid Fire is tested against many versions of Ember using [ember-try](https://github.com/ember-cli/ember-try). The oldest supported version is listed in `versionCompatibility` in `package.json`, and in CI we test every minor release since then, through beta and canary.
