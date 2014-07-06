import Ember from "ember";
import transitions from "../transitions";

var StickyChild = Ember.ContainerView.extend({
  classNames: ['sticky-child'],
  
  resolveInsertionPromise: function(){
    if (this._resolveInsertion) {
      this._resolveInsertion(this);
    }
  }.on('didInsertElement')
  
});

export default Ember.ContainerView.extend({
  classNames: ['sticky-outlet'],

  init: function(){
    var currentView = this.get('currentView');
    if (currentView) {
      this.set('currentView', StickyChild.create({
	currentView: currentView,
	entering: false
      }));
    }
    this._super();
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
	newView = this.get('currentView'),
	transition = transitions.lookup(oldView, newView);

    if (this._runningTransition) {
      this._runningTransition.interrupt();
    }

    this._runningTransition = transition;
    transition.run(this);
  }),
  
  _pushNewView: function(newView) {
    var child = StickyChild.create({currentView: newView}),
	promise = new Promise(function(resolve) {
	  child._resolveInsertion = resolve;
	});
    this.pushObject(child);
    return promise;
  }


});

