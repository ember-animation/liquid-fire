API design todos:
- serial vs parallel transition
- pluggable "done" handling. Promise-based.
- directionality

Thoughts
--------

### Architectural

Cross-route animated transitions don't fit neatly into any single part
of the Ember architecture. You want the view layer to deal with
actually moving DIVs around, etc. But you want the routing layer to
decide what the spatial relationship between routes should be.

We split these concerns by establishing a directionality API between
routes and views. Routes just say "I'm to the left (or right, or
above, etc) of that other route". Views need to know how to transition
appropriate in the direction they're told.

### Spatial Descriptors

A transition from route A with params Pa to route B with params Pb can
have one of the following spatial relationships:

- none (there's no spatial relationship. Views can interpret this how
  they want -- maybe no transition, maybe a default transition.)
- left
- right
- up
- down
- front
- back

The relationship may depend on the parameters of the routes.

They are not necessarily reflexive or transitive (we're not dealing
with real space). But in a sane app they often will be.

### Types of Animations

- within a single route, scalar context (done already in previous animation-demo)
- within a single route, model context (can be readily extended from the preceeding)
- between traditional routes (the new sticky-outlet + route directionality api)
- between morphing routes (ooh shiny)


### Morphing Routes

The goal is to do something like the Contacts example here:

http://www.google.com/design/spec/animation/meaningful-transitions.html

I think we can do it by building
 - a single dual-purple view & controller that have morphing capabilities
- a (child) route that potentially loads new data as usual and adds it
  to the controller, but doesn't touch outlets at all by itself.
