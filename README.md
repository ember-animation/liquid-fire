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
    ember g liquid-fire


### Documentation 

Liquid Fire itself is an ember-cli application that runs an
interactive demo & documentation. [The docs are here](http://ef4.github.io/liquid-fire).

You can also see some examples in my [Ember Animation Demo](http://github.com/ef4/ember-animation-demo) repo, and this [video presentation from the Boston Ember Meetup](https://www.youtube.com/watch?v=S4M78SO3gAc).

### Source Organization

This repo contains both the liquid-fire library and a demo application
that presents interactive documentation. The library code is in:

 - index.js
 - app-addon
 - vendor-addon

The demo app is organized like a typical ember-cli application, so all
of these are for the demo application:

 - Brocfile.js
 - app
 - config
 - public
 - vendor
 - snippets (which get rendered by [ember-code-snippet](http://github.com/ef4/ember-code-snippet))
