import Ember from "ember";
import { Promise } from "../libs/liquid-fire";
import transitions from "../transitions";

export default Ember.ContainerView.extend({
  classNames: ['liquid-outlet'],

  init: function(){
    // The ContainerView constructor normally sticks our "currentView"
    // directly into _childViews, but we want to leave that up to
    // _currentViewDidChange so we have the opportunity to launch a
    // transition.
    this._super();
    this._childViews.clear();
  },

  // Deliberately overriding a private method from
  // Ember.ContainerView!
  //
  // We need to stop it from destroying our outgoing child view
  // prematurely.
  _currentViewWillChange: Ember.beforeObserver('currentView', function() {}),

  // Deliberately overriding a private method from
  // Ember.ContainerView!
  _currentViewDidChange: Ember.observer('currentView', function() {
    // Normally there is only one child (the view we're
    // replacing). But sometimes there may be two children (because a
    // transition is already in progress). In any case, we tell all of
    // them to start heading for the exits now.

    var oldView = this.get('childViews.lastObject'),
        newView = this.get('currentView');

    if (oldView && oldView.get('currentView') === newView) {
      return;
    }
    
    var transition = transitions.lookup(oldView, newView);

    if (this._runningTransition) {
      this._runningTransition.interrupt();
    }

    this._runningTransition = transition;
    transition.run(this);
  }).on('init'),

  _liquidChildFor: function(content) {
    var LiquidChild = this.container.lookupFactory('view:liquid-child');
    return LiquidChild.create({
      currentView: content
    });
  },
  
  _pushNewView: function(newView) {
    var child = this._liquidChildFor(newView),
        promise = new Promise(function(resolve) {
          child._resolveInsertion = resolve;
        });
    this.pushObject(child);
    return promise;
  }


});

