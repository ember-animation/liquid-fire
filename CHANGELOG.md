# Changelog

## 0.35.0 (2023-01-24)

- ENHANCEMENT: replace internal jquery usages (there is now possible to use this package without jquery as dependency) (#674)

## 0.34.0 (2022-01-19)

- BREAKING: oldest supported Ember is now 3.16
- COMPAT: full compatibility with Ember 4.1 and Embroider by @rwwagner90

## 0.33.1 (2022-01-02)

- BUGFIX: the compatibility code in 0.33.0 failed in a confusing way that was only detectable when not working with the test suite

## 0.33.0 (2021-11-27)

- COMPAT: compatibility with Ember 4.0. Since Ember 4.0 drops support for named outlets, `{{liquid-outlet}}` with a name argument is also no longer supported when you use Ember >= 4. On earlier Ember versions, named liquid-outlet is still supported but will hit Ember's named outlet deprecation.

## 0.32.0 (2021-10-17)

- COMPAT: should be deprecation-clean up through Ember 3.28. Thanks @rwwagner90
- BREAKING: drop node < 12 support
- BREAKING: drop ember versions prior to 3.8

## 0.31.0 (2019-10-16)

- BUGFIX: make liquid-spacer observe window size changes, by @mattdonnelly
- HOUSEKEEPING: remove dependency on old version of ember-copy, by @jherdman
- COMPAT: fix our test suite under ember 3.13.
- HOUSEKEEPING: use assign instead of merge, by @Penthious

## 0.30.0 (2019-06-10)

- BREAKING: dropped support for Ember < 2.12. This is in anticipation of an upcoming major release that will switch the underlying implementation to use ember-animated.
- HOUSEKEEPING: fixed deprecation warnings up to Ember 3.10.

## 0.29.5

- BUGFIX: don't leak bootstrap from docs app into consuming apps

## 0.29.4

- HOUSEKEEPING: removing some jQuery usage by @cibernox
- HOUSEKEEPING: satisfy newer better eslint rules by @brettburley
- DOCS: docs site visual redesign by @brettburley
- BUGFIX: guard against notifying a destroyed container by @earnnest-greenville
- HOUSEKEEPING: fix send-action deprecation in ember 3.4 by scottkidder
- HOUSEKEEPING: fix ember-copy deprecation by @wagenet
- DOCS: readme patch by @acorncom

## 0.29.3

- BUGFIX: Fix visibility during explode with nested animators by @brettburley
- BUGFIX: Fix link in demo/docs site by @lolmaus

## 0.29.2

- BUGFIX: Use a stricter constraint on what velocity version we depend on.
- HOUSEKEEPING: upgraded ember-cli and removed some deprecations from the test suite

## 0.29.1

- BUGFIX: The previous published package accidentally embedded 153MB of node modules that were stashed by ember-try.

## 0.29.0

- HOUSEKEEPING: upgraded to new ember-cli and ember-source for the dummy app. Switched to newer module imports and coding standard.
- ENHANCEMENT: docs site now has fastboot-rendered static content (yes, on GitHub pages!)
- BUGFIX: account for scaling transforms in liquid-measured by @wagenet

## 0.28.1

- HOUSEKEEPING: dependency upgrade by @Turbo87 that helps apps drop ember-cli-shims
- DOCS: readme improvement by @swgarmerx

## 0.28.0

- HOUSEKEEPING: cleared some deprecations, updated some build deps (@jrjohnson, @ef4, @rwjblue)
- ENHANCEMENT: add a default blueprint to generate transitions.js by @FilmKnurd
- BUGFIX: fixed fastboot tests by @simonihmig
- HOUSEKEEPING: ember-cli update by @cibernox
- ENHANCEMENT: allow wait transition to pass optionss by @rtablada

## 0.27.3

- BUGFIX: better blueprint style by kellyselden
- HOUSEKEEPING: fastboot compatibility and tests by simonihmig
- BUGFIX: documentation type by locks
- HOUSEKEEPING: upgrade babel & fix travis caching by rwjblue

## 0.27.2

- BUGFIX: build-time fixes by @akatov and @ivanvanderbyl
- HOUSEKEEPING: ember-cli upgrade

## 0.27.1

- DOCS: fixes by @mellogarrett
- BUGFIX: maintain existing rAF timestamp behavior despite an upstream velocity change by @jrowlingson
- HOUSEKEEPING: ember-cli upgrade and lookupFactory deprecation fixes by @cibernox
- BUGFIX: allow a wider range of ember-getowner-polyfill versions by @kturney

## 0.27.0

- ENHANCEMENT: new growthDelay and shrinkDelay options added by kybishop
- HOUSEKEEPING: upgrade ember-getowner-polyfill to avoid potential deprecation warnings

## 0.26.7

- HOUSEKEEPING: upgrade ember-hash-helper-polyfill for compatibiltiy with ember via npm by cibernox

## 0.26.6

- BUGFIX: Ensure version specific trees are processed properly by rwjblue

## 0.26.5

- BUGFIX: fixed build & import issues within nested addons by knownasilya
- HOUSEKEEPING: support ember source from npm by kamalaknn

## 0.26.4

- BUGFIX: the previous fix for a fastboot regression broke normal usage in some versions of ember-cli

## 0.26.3

- BUGFIX: regression on old node versions
- BUGFIX: regression in fastboot by @trabus

## 0.26.2

- BUGFIX: pass args when calling super by @dwickern
- BUGFIX: Load velocity.js as an AMD module by @ebryn
- BUGFIX: update version checks due to Ember 2.9 shipping without glimmer2
- HOUSEKEEPING: added yarn.lock for development within liquid-fire. This does not effect consumers of the addon.

## 0.26.1

- BUGFIX: don't attempt to assert velocity-animate version at build time (ember-cli-version-checker doesn't look into recursiv deps, and this check wasn't really necessary anyway)

## 0.26.0

- Significant internal refactor that includes full Glimmer2 compatibility.
- BUGFIX: several glimmer2-relatd fixes by @rwjblue.
- BUGFIX: element dimnsion rounding by @lawitschka (#483)
- BUGFIX: Fix prebuilt-example link by @blimmer (#488)
- No known semantic breakage since 0.25.0.
- We now automatically swap out Ember-version-specific implementations at build time, so we maintain wide compatibility with no runtime size overhead.
- This release works with Ember 1.13 through 2.10.0-canary+6dc97146.

## 0.25.0

- BREAKING: Removed liquid-modal. It used too much private API and [ember-elsewhere](https://github.com/ef4/ember-elsewhere) is a superior alernative that composes nicely with liquid-fire.
- BREAKING: liquid-outlet, liquid-bind, liquid-if, and liquid-unless all formerly accepted an `id` parameter that would set the `id` attribute on their `.liquid-container` element. Glimmer2 has become more strict and doesn't allow this potentially-confusing reuse of the `id` parameter on a tagless component. So you must change `{{liquid-outlet id="something"}}` to `{{liquid-outlet containerId="something"}}`.
- BUGFIX: compatibility updates for the Ember 2.8 beta series by @wagenet
- BUGFIX: memory leak by @cibernox
- HOUSEKEEPING: switched to ember-sinon and added travis badge by @kellyselden
- HOUSEKEEPING: upgrade ember-cli-htmlbars-inline-precompile to remove warnings by @gavinjoyce
- HOUSEKEEPING: upgrade ember-cli-qunit

## 0.24.1:

- BUGFIX: more useful timing for the liquid-animating class (563adc)

### 0.24.0:

- DOC: outletName by @knownasilya
- DOC: readme update by @coryondemand
- BUGFIX: Updated transition blueprint by @alexspeller
- BUGFIX: Renaming to match new repo location by @tricknotes
- BUGFIX: Renaming to match new repo location by @tricknotes
- BUGFIX: fixed ember-cli deprecation about this.\_super.init by @rwjblue
- BUGFIX: compatibility update for ember canary by @cryrivers
- ENHANCEMENT: we now use ember-try's `useVersionCompatibility` option in CI to test every minor release since 1.13.x
- ENHANCEMENT: configurable directions for liquid-spacer by @alisdair
- ENHANCEMENT: locally scoped rules (see af74d3)
- ENHANCEMENT: liquid-sync component lets you declare that something needs to happen before a component is ready to be animated
- EXPERIMENTAL: added watchModels option to liquid-outlet and added illiquid-model component. Together they allow model-to-model transitions to be animated directly from the liquid-outlet.
- HOUSEKEEPING: updated our repo organization to match modern conventions
- HOUSEKEEPING: removed liquid-with, which had been deprecated for a long time

### 0.23.1:

- noop release, because I published a backport release (0.19.6) to the latest "npm tag" (which in git terms is a lot closer to a branch than a tag), which was causing users to get 0.19.6 preferentially over 0.23.0.

### 0.23.0:

- BUGFIX: make liquid-fire build correctly when included by another addon by @knownasilya
- DOC FIXES by @kiwiupover
- ENHANCEMENT: added `wait` transition
- ENHANCEMENT: new cookbook section in the docs by @frederikbosch
- ENHANCEMENT: expanded demos of predefined transitions in the docs by @IgorKvasn
- NOTICE: we have moved into a new GitHub organization, so update references to ef4/liquid-fire to ember-animation/liquid-fire.

### 0.22.1:

- BUGFIX: safer fastboot build guards by @tomdale.

### 0.22.0:

- ENHANCEMENT: Adds a `media` contraint for matching transitions by media query by @mattgrannary.
- ENHANCEMENT: Add lf-modal-closing class while a modal closing by @Cryrivers
- ENHANCEMENT: improved documentation for predefined transitions by @IgorKvasn
- ENHANCEMENT: documentation fixes by @ScottLNorvell and @kalmanh
- ENHANCEMENT: fastboot compatibility guards by @rondale-sc
- ENHANCEMENT: get-owner-polyfill for compatibility with Ember 2.3 by @rwjblue
- ENHANCEMENT: Fix tests for lack of `autoboot: false` support in Ember 2.2 by @rwjblue.
- BUGFIX: Fixes loading substates not being called by @erkie

### 0.21.3

- BUGFIX: several minor bugfixes and compatibility updates

### 0.21.2

- BUGFIX: compatibility with internal Ember changes on 1.13.7.

### 0.21.1

- ENHANCEMENT: new `outletName` constraint by @knownasilya.
- BUGFIX: deprecation cleanups by @rwjblue.
- BUGFIX: updated liquid-modal to work with newest canary by @rwjblue.

### 0.21.0

- ENHANCEMENT: liquid-bind in block form

  `liquid-bind` can now accept a block, in which case it will yield
  it's value to the block, and allow you to animate the whole block
  when the value changes. This is the best way to animate
  model-to-model transitions.

- DEPRECATED: liquid-with

  `liquid-with` was originally named because it matched Ember's
  normal `with` helper. But the normal `with` helper lost much of
  its raison d'être when it's scope-shifting forms were
  deprecated, and I don't expect most new Ember users to ever encounter it.

  Therefore, I'm deprecating `liquid-with` in favor of using
  `liquid-bind` in block form, because I think `liquid-bind` reads
  better.

- BUGFIX: made liquid-modals fully compatible with Ember 1.13.
- BUGFIX: clean up many uses of deprecated Ember APIs
- PR #334 from jamesreggio: respect enableGrowth=false
- PR #322 from machty: Ember.keys deprecation
- PR #321 from EricSchank: Document useAndReverse

### 0.20.4

- Shouldn't have hit publish on 0.20.3 until waiting for travis to go
  green. :-p

### 0.20.3

- Bugfix for liquid-spacer (#302)

### 0.20.2

- Update to match a changed private API in Ember.

### 0.20.1

- PR #293 byjimnanney: matchBy data elements whose value needs quotes
- PR #294 from salzhrani: Canary expects services to be a subclass of Ember.Service
- PR #288 from raycohen: documentation fix
- PR #241 from albertodotcom: improved explode
- PR #284 from lolmaus: documentation
- PR #291 from jrjohnson: documentation

### 0.20.0

- Glimmer compatibility: this is the liquid-fire version you want to
  be using with Ember 1.13 and beyond.

### 0.19.2

- BUGFIX: fix `class` in containerless mode. (Issue #236)

- NEW: it should now be possible to build non-ember-cli releases of
  liquid-fire using
  [Ember Giftwrap](https://github.com/ef4/ember-giftwrap).

### 0.19.1

- BUGFIX: the experimental model-to-model liquid-outlet transitions
  are not compatible with the current way we use liquid-outlet and
  liquid-with nested together. I'm reverting this capability until we
  can make it the default and only supported way. (Issue #235).

### 0.19.0

- This is a major refactor with many new features and many API
  changes, as we move rapidly toward a stable 1.0 release.

- NEW: add `this.debug()` to any transition rule to make it verbosely
  log why it is or isn't matching every possible transition.

       this.transition(
         this.fromRoute('foo'),
         this.toRoute('bar'),
         this.use('fade'),
         this.debug()
       );

- NEW: the `explode` transition lets you pull apart the elements
  you're animating and then target each of the separate pieces with
  other transitions. By allowing arbitrary pairwise matching, it
  enables powerful new things like hero transitions and animated list
  changes.

- NEW: the `flyTo` transition makes its oldElement fly to the
  position of newElement, growing or shrinking its dimensions to
  match by the time it gets there. Used in conjunction with `explode`
  it enables rich hero transitions.

- NEW: the `inHelper` transition constraint lets you limit a rule to
  a particular template helper name. For example
  `inHelper('liquid-if')` is a constraint that only matches
  `liquid-if` helpers.

- NEW: the `matchSelector` transition constraint lets you limit your
  transition rule to an arbitrary CSS selector. The older `childOf`
  becomes just a special case of `matchSelector`.

- NEW: the `onInitialRender` constraint makes a transition rule only
  match only elements that are rendering for the first time. This
  replaces the old and ambiguous `fromRoute(null)`, and it also
  handles non-outlet helpers like liquid-if.

- NEW: `includingInitialRender` is just like `onInitialRender` except
  it matches both initial and non-initial renders.

- NEW: it is much easier to override or customize the animations used
  for showing and hiding modals. Just write a rule like
  `inHelper('liquid-modal')` and give it an animation. You can
  manipaulate the background overlay and dialog box separately using
  the `explode` transition. See the default liquid-modal rule in
  `internal-rules.js` for an example.

- BREAKING: when more than one transition rule matches a transition,
  we used to just pick whichever one we found first via depth-first
  search. Now we use the one that is more specific (that has more
  constraints). Ties are broken in favor of rules that appear later
  in the transition map.

- BREAKING: the API for implementing custom transition animations has
  been significantly simplified. The old API was to implement a
  function like:

       function myAnimation(oldView, insertNewView) {
         return insertNewView().then(function(newView) {
           return Promise.all([
             doSomethingWith(oldView.$()),
             doAnotherThingWith(newView.$())
           ]);
         });
       }

  That has been simplified to:

       function myAnimation() {
         return Promise.all([
           doSomethingWith(this.oldElement),
           doAnotherThingWith(this.newElement)
         ]);
       }

  Full docs for the API forthcoming.

- BREAKING: to correspond with the above change, the animation
  helpers `animate`, `stop`, etc, have been updated to take a jQuery
  element instead of a View.

- BREAKING: the `fromRoute`, `toRoute`, and `withinRoute` rule
  constraints used to accept a variable number of route names as
  arguments, any of which would satisfy the constraint. This is no
  longer supported. You can get the same effect by passing a single
  array argument. So change:

       this.fromRoute('a', 'b');

  to

       this.fromRoute(['a', 'b']);

- BREAKING: route constraints only apply to liquid-outlets. Other
  helpers like liquid-if used to try to figure out what route they
  were in so they could respect `withinRoute` constraints, but this
  is both complicated and not a good idea. Only outlets are supposed
  to know about routes -- each helper should only animate based on
  its own well-encapsulated state.

- BREAKING: `fromModel`, `toModel`, `betweenModels` now only apply to
  actual models during route transitions in a liquid-outlet. They
  don't apply to the values you pass to other liquid helpers.

  There is are separate `fromValue`, `toValue`, `betweenValues` rules
  for matching the values passed to liquid-if, liquid-with, or
  liquid-bind. It didn't make sense to always call this "model", and
  it complicates the architecture to conflate them.

- EXPERIMENTAL: the `toModal` and `fromModal` constraints let you
  target specific modals by name. This is marked experimental because
  I'm planning to try to revamp the whole modal API to make it nicer
  before stabilizing in 1.0, possibly by cooperating with another
  ember modal addon.

- NEW: a `liquid-animating` class is added to the parent `liquid-container`
  while an animation is in progress. This allows any customized CSS rules
  to be added if needed.

- EXPERIMENTAL: `liquid-outlet` can now detect and animate
  model-to-model transitions on the same route. HOWEVER, this is not
  a complete solution, due to the fact that both your old and new
  views will usually be bound to the same singleton controller, so
  the old state will instantly rerender instead of preserving the old
  values until animation is done. Ember 2.0 will eliminate the
  singleton controller, solving this problem completely.

### 0.18.0

- COMPAT: fully compatible with the current Ember 1.11 beta series
  and canary.

- BREAKING: master is now only compatible with Ember 1.11 and
  newer. Older versions of Ember are still supported on the oldstable
  branch, which is released to npm as 0.17.x.

- BREAKING: We require full ES6 transpilation. The future is
  now. `ember install:addon ember-cli-babel`.

- Dropped large swaths of code for pre-HTMLBars support.

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

```js
this.fromRoute(function () {
  return /special_/.test(this);
});
```

You need to change it to:

```js
this.fromRoute(function (routeName) {
  return /special_/.test(routeName);
});
```

Similarly, a rule like:

```js
this.fromModel(function () {
  return this.get('age') > 21;
});
```

Becomes:

```js
this.fromModel(function (model) {
  return model.get('age') > 21;
});
```

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

  - `otherParams` is a new option that lets you bind parameters
    through to the modal component. Unlike `withParams`, they will
    not be used to determine if the modal should be rendered.

  - both `otherParams` and `withParams` now allows parameter names to
    be arbitrarily remapped, so:

    ```javascript
    this.modal('your-modal', {
      withParams: ['foo', { bar: 'baz' }],
    });
    ```

    Is equivalent to a normal in-template component invoked like this:

    ```hbs
    {{your-modal foo=foo bar=baz}}
    ```

### 0.14.0

- BREAKING: we have updated the format of liquid-fire to be compatible
  with the latest ember-cli. As a result, we were able to simplify the
  way liquid-fire exports values to your code. You will need to change
  imports like this:

  ```js
  import animate from 'vendor/liquid-fire';
  ```

  Like this:

  ```js
  import animate from 'liquid-fire';
  ```

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
  liquid-children, but _not_ their id, because multiple children will
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
  your app namespace. Import it like `import { animate } from "vendor/liquid-fire"`
