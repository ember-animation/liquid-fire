# Changelog

### 0.17.1

 - COMPAT: This release cleans up all deprecation warnings through
   Ember 1.10. The 0.17.x series will be in maintenance mode from here
   on out on the `oldstable` branch, while future work on `master`
   will be compatible only with Ember 1.11 and newer.


### 0.17.0

 - BREAKING: the API for route and model matcher functions in your
   transition rules has changed. Instead of passing the
   object-to-be-tested as `this`, we pass it as the first argument. So
   if you have a rule like:

      this.fromRoute(function(){ return /special_/.test(this); })

   You need to change it to:

      this.fromRoute(function(routeName){ return /special_/.test(routeName); })

   Similarly, a rule like:

      this.fromModel(function(){ return this.get('age') > 21; })

   Becomes:

      this.fromModel(function(model){ return model.get('age') > 21; })

   This change is necessary to gracefully handle all the cases where
   the object being tested may be undefined, since `this` is not
   necessarily allowed to be undefined.

 - ENHANCEMENT: liquid-spacer is ready to go and documented. This is a
   new helper that provides a standalone growable container that
   animates whenever its content changes.

 - ENHANCEMENT: added an ember-cli blueprint for generating
   transitions. Run `ember generate transition some-name`. Thanks
   @lukesargeant.

### 0.16.3

 - BUGFIX: previous change introduced a new requirement for apps to
   use ember-cli-6to5. This was unintentional and if we do start to
   require it, we will do so with a major version bump.

### 0.16.2

- ENHANCEMENT: added an unstable and undocumented component called
  liquid-spacer.

### 0.16.1

- COMPAT: several fixes to keep up with Ember canary changes. Thanks @rlivsey.

### 0.16.0

- ENHANCEMENT: compatibility updates to for Ember 1.9 through
  canary. Thanks @rwjblue for spearheading this work.

- BUGFIX: fixed nested outlets in non-ember-cli apps.

### 0.15.2

- BUGFIX: fixed loading of transition map when loaded via globals (#133)


### 0.15.1

- BUGFIX: fixed dismissing modals with remapped withParams (#128)

### 0.15.0

- ENHANCEMENT: improved liquid-modal API by @rlivsey.

   * `otherParams` is a new option that lets you bind parameters
     through to the modal component. Unlike `withParams`, they will
     not be used to determine if the modal should be rendered.

   * both `otherParams` and `withParams` now allows parameter names to
     be arbitrarily remapped, so:

        ````javascript
        this.modal('your-modal', {
          withParams: ['foo', { bar: 'baz'}]
        });
        ````

        Is equivalent to a normal in-template component invoked like this:

        ````javascript
        {{your-modal foo=foo bar=baz}}
        ````


### 0.14.0

- BREAKING: we have updated the format of liquid-fire to be compatible
  with the latest ember-cli. As a result, we were able to simplify the
  way liquid-fire exports values to your code. You will need to change
  imports like this:

        import animate from "vendor/liquid-fire";

    Like this:

        import animate from "liquid-fire";

- ENHANCEMENT: Now compatible with the newest 1.9 beta series and 1.10
  canary.

- ENHANCEMENT: Added a new "scrollThen" predefined transition. Thanks
  @jerel.

- BUGFIX: non-cli builds should be es3 safe.

- BUGFIX: fixes outlets inside liquid-with. (#112)

### 0.13.0

- FEATURE: modals can now send actions to their containing
  controller. Thanks @rlivsey.

- FEATURE: improved compatibility with new versions of RSVP

- BUGFIX: modals will properly bind their aria-label properties.

- CHANGE: minor refinements to the modal popup animation.

### 0.12.0

- CHANGE: to more easily distinguish between false-ish contexts and
  the initial render, transition rules will now only match the
  initial render if they explicitly say `fromRoute(null)`.

- BUGFIX: fixed container size animations when transitioning to empty
  states. (#97)

### 0.11.1

- BUGFIX: containerless component should pass their class onto their
  liquid-children, but *not* their id, because multiple children will
  be in the dom together.

### 0.11.0

- CHANGE: modals are now opt-in. You turn them on in your application
  by inserting a `{{liquid-modal}}` tag in your application
  template. This avoids us doing non-standard things that make the
  load order fragile and break the Ember inspector.

- BUGFIX: containerless components should pass any class or id
  arguments onto their liquid-child element.

### 0.10.0

- CHANGE: `liquid-outlet`, `liquid-if`, and `liquid-with` no longer
  insert a liquid-child element when they are empty. This may subtly
  change your transition matching rules if you were relying on the
  fact that an absent oldView could only happen at initial render,
  because now it can be absent at other times.

- CHANGE: `use` is a shorthand for when you just want to specify a
  transition to always run. But since we offer the option of animating
  at initial render, and since we think that's the less-common case,
  `use` has always refused to match transitions with an absent
  `oldView`. But due to the previously mentioned change, absent
  `oldView` can now happen at times other than initial render, so
  `use` has been updated to animate even when `oldView` is
  absent. Instead it checks explicitly for the initial render case.

- FEATURE: added a `containerless` option to the helpers. If set, we
  don't render a `.liquid-container` element and we don't manage
  `position`, `width`, or `height` for the child elements. This can be
  useful when the user wants to manage their own container
  differently. For example, see this
  [flexbox-based demo](http://ef4.github.io/liquid-fire/#/scenarios/growable-flexboxes). 

- BUGFIX: modal initialization was broken for apps with autogenerated
  application controller.

- BUGFIX: modal initialization was broken for apps using global
  namespacing.

### 0.9.2

- Bugfix: restore ES3 compatibility (#67).

### 0.9.1

- Patch release: 0.9.0 was only compatible with ember-cli 0.0.44. This
  restores backward compatibility for other recent versions of ember-cli.

### 0.9.0

- Enhancement: [modal dialogs](http://ef4.github.io/liquid-fire/#/modals).

- Updated to the newest ember-addon API. Thanks @jakecraige.

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
