import Ember from "ember";
import { Promise, animate, stop } from "liquid-fire";
var capitalize = Ember.String.capitalize;

export default Ember.ContainerView.extend({
  classNames: ['liquid-container'],
  growDuration: 250,
  growPixelsPerSecond: 200,
  growEasing: 'slide',
  enableGrowth: true,

  init: function(){
    // The ContainerView constructor normally sticks our "currentView"
    // directly into _childViews, but we want to leave that up to
    // _currentViewDidChange so we have the opportunity to launch a
    // transition.
    this._super();
    Ember.A(this._childViews).clear();

    if (this.get('containerless')) {
      // This prevents Ember from throwing an assertion when we try to
      // render as a virtual view.
      this.set('innerClassNameBindings', this.get('classNameBindings'));
      this.set('classNameBindings', Ember.A());
    }
  },

  // Deliberately overriding a private method from
  // Ember.ContainerView!
  //
  // We need to stop it from destroying our outgoing child view
  // prematurely.
  _currentViewWillChange: Ember.beforeObserver('currentView', function() {}),

  // Deliberately overriding a private method from
  // Ember.ContainerView!
  _currentViewDidChange: Ember.on('init', Ember.observer('currentView', function() {
    // Normally there is only one child (the view we're
    // replacing). But sometimes there may be two children (because a
    // transition is already in progress). In any case, we tell all of
    // them to start heading for the exits now.

    var oldView = this.get('childViews.lastObject'),
        newView = this.get('currentView'),
        firstTime;

    // For the convenience of the transition rules, we explicitly
    // track our first transition, which happens at initial render.
    firstTime = !this._hasTransitioned;
    this._hasTransitioned = true;

    // Idempotence
    if ((!oldView && !newView) ||
        (oldView && oldView.get('currentView') === newView) ||
        (this._runningTransition &&
         this._runningTransition.oldView === oldView &&
         this._runningTransition.newContent === newView
        )) {
      return;
    }

    // `transitions` comes from dependency injection, see the
    // liquid-fire app initializer.
    var transition = this.get('transitions').transitionFor(this, oldView, newView, this.get('use'), firstTime);

    if (this._runningTransition) {
      this._runningTransition.interrupt();
    }

    this._runningTransition = transition;
    transition.run().catch(function(err){
      // Force any errors through to the RSVP error handler, because
      // of https://github.com/tildeio/rsvp.js/pull/278.  The fix got
      // into Ember 1.7, so we can drop this once we decide 1.6 is
      // EOL.
      Ember.RSVP.Promise.resolve()._onerror(err);
    });
  })),

  _liquidChildFor: function(content) {
    if (content && !content.get('hasLiquidContext')){
      content.set('liquidContext', content.get('context'));
    }
    var LiquidChild = this.container.lookupFactory('view:liquid-child');
    var childProperties = {
      currentView: content
    };
    if (this.get('containerless')) {
      childProperties.classNames = this.get('classNames').without('liquid-container');
      childProperties.classNameBindings = this.get('innerClassNameBindings');
    }
    return LiquidChild.create(childProperties);
  },

  _pushNewView: function(newView) {
    if (!newView) {
      return Promise.resolve();
    }
    var child = this._liquidChildFor(newView),
        promise = new Promise(function(resolve) {
          child._resolveInsertion = resolve;
        });
    this.pushObject(child);
    return promise;
  },

  cacheSize: function() {
    var elt = this.$();
    if (elt) {
      // Measure original size.
      this._cachedSize = getSize(elt);
    }
  },

  unlockSize: function() {
    var self = this;
    function doUnlock(){
      var elt = self.$();
      if (elt) {
        elt.css({width: '', height: ''});
      }
    }
    if (this._scaling) {
      this._scaling.then(doUnlock);
    } else {
      doUnlock();
    }
  },

  _durationFor: function(before, after) {
    return Math.min(this.get('growDuration'), 1000*Math.abs(before - after)/this.get('growPixelsPerSecond'));
  },

  _adaptDimension: function(dimension, before, after) {
    if (before[dimension] === after[dimension] || !this.get('enableGrowth')) {
      var elt = this.$();
      if (elt) {
        elt[dimension](after[dimension]);
      }
      return Promise.resolve();
    } else {
      // Velocity deals in literal width/height, whereas jQuery deals
      // in box-sizing-dependent measurements.
      var target = {};
      target[dimension] = [
        after['literal'+capitalize(dimension)],
        before['literal'+capitalize(dimension)],
      ];
      return animate(this, target, {
        duration: this._durationFor(before[dimension], after[dimension]),
        queue: false,
        easing: this.get('growEasing')
      });
    }
  },

  adaptSize: function() {
    stop(this);

    var elt = this.$();
    if (!elt) { return; }

    // Measure new size.
    var newSize = getSize(elt);
    if (typeof(this._cachedSize) === 'undefined') {
      this._cachedSize = newSize;
    }

    // Now that measurements have been taken, lock the size
    // before the invoking the scaling transition.
    elt.width(this._cachedSize.width);
    elt.height(this._cachedSize.height);

    this._scaling = Promise.all([
      this._adaptDimension('width', this._cachedSize, newSize),
      this._adaptDimension('height', this._cachedSize, newSize),
    ]);
  }

});

// We're tracking both jQuery's box-sizing dependent measurements and
// the literal CSS properties, because it's nice to get/set dimensions
// with jQuery and not worry about boz-sizing *but* Velocity needs the
// raw values.
function getSize(elt) {
  return {
    width: elt.width(),
    literalWidth: parseInt(elt.css('width'),10),
    height: elt.height(),
    literalHeight: parseInt(elt.css('height'),10)
  };
}
