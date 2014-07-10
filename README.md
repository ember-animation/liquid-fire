Liquid Fire
===========

Comprehensive animation support for ambitious Ember applications.

## Features

- Animated transitions between routes that work seamlesssly with the
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

This is an ember-cli addon, so (*once I publish it to npm*) all you need is:

    npm install --save-dev liquid-fire



## Architectural

Cross-route animated transitions don't fit neatly into any single part
of the Ember architecture. You want the view layer to deal with
actually moving DIVs around, etc. But you want the routing layer to
decide what the spatial relationship between routes should be.

We split these concerns by establishing a directionality API between
routes and views. Routes just say "I'm to the left (or right, or
above, etc) of that other route". Views need to know how to transition
appropriate in the direction they're told.


### More Documentation to Come!

For now, see some examples in my [Ember Animation Demo](http://github.com/ef4/ember-animation-demo) repo.
