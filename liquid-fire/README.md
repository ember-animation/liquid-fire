# Liquid Fire

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

## Documentation

[Liquid Fire website](http://ember-animation.github.io/liquid-fire) is an ember-cli application that contains an
interactive demo & documentation. It runs from Liquid Fire's [test dummy app](https://github.com/ember-animation/liquid-fire/tree/master/tests/dummy/app).

You can also see some examples in my [Ember Animation Demo](http://github.com/ef4/ember-animation-demo) repo, and this [video presentation from the Boston Ember Meetup](https://www.youtube.com/watch?v=S4M78SO3gAc).

### Ember Compatibility Table

| Ember Version     | Liquid Fire Release |
| ----------------- | ------------------- |
| 3.28 and newer    | latest              |
| 3.16 through 4.12 | 0.35.x              |
| 2.12 through 3.15 | 0.33.x              |
| 1.13 through 2.11 | 0.29.x              |
| 1.11 through 1.12 | 0.19.x              |
| 1.8 through 1.10  | 0.17.x              |

## Development

### Source Organization

This repo contains both the liquid-fire library and a demo application
that presents interactive documentation. It follows standard ember-cli
addon v2 format.

- liquid-fire: is code that can be imported by the user from the `liquid-fire` namespace
- docs: is the demo and documentation application
- test-app: is the testing

## Testing

When running tests you'll want to set your transition speeds to 0 so they don't slow down your tests. This can be accomplished by using an Environment variable.

```javascript
// Import the Environment
import ENV from "your-application-name/config/environment";

// If Testing Environment
if (ENV.environment === "test") {
  var customDuration = 0; // set to 0 seconds
} else {
  var customDuration = 200; // set to 200 miliseconds
}

this.transition(
  this.toRoute("foo"),
  this.use("toLeft", { duration: customDuration }) // Use customDuration
);
```
