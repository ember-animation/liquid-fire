Liquid Fire
===========

Comprehensive animation support for ambitious Ember applications. [Interactive Documentation is here](http://ef4.github.io/liquid-fire).

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
  

## Installation

This is an ember-cli addon, so all you need is:

    npm install --save-dev liquid-fire


### Documentation 

Liquid Fire itself is an ember-cli application that runs an
interactive demo & documentation. [The docs are here](http://ef4.github.io/liquid-fire).

You can also see some examples in my [Ember Animation Demo](http://github.com/ef4/ember-animation-demo) repo, and this [video presentation from the Boston Ember Meetup](https://www.youtube.com/watch?v=S4M78SO3gAc).

## Development

### Source Organization

This repo contains both the liquid-fire library and a demo application
that presents interactive documentation. It follows standard ember-cli
addon format.

 - app: is code that's loaded directly into the user's application
 - addon: is code that can be imported by the user from the `liquid-fire` namespace
 - tests/dummy: is the testing, demo, and documentation application that runs at http://ef4.github.com/liquid-fire
 - packaging: extra tooling for building non-ember-cli releases

### Selecting Ember Versions

Liquid Fire is tested against release, beta, canary, and canary +
HTMLbars versions of Ember. While developing Liquid Fire, you can
switch to a different Ember environment by using the
`packaging/select-ember-version.js` script in conjunction with
the environment variables used within the `env.matrix` section of
`.travis.yml`, e.g.:

    # switch to Ember Canary with HTMLbars enabled
    $ EMBER_CHANNEL=canary HTMLBARS=true packaging/select-ember-version.js

After running this command and re-running `ember serve`, the ember-cli
server (and QUnit test suite) will be running against Ember Canary +
HTMLBars.


