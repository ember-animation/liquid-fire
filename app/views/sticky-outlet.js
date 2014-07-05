import Ember from "ember";
var Prom = Ember.RSVP.Promise;

var StickyChild = Ember.ContainerView.extend({
  classNames: ['sticky-child'],
  entering: true,

  spatialContext: function() {
    return spatialContext(this.get('currentView'));
  },

  motionFor: function(forNewView, oldContext, newContext) {
    var offset = 100;
    if (oldContext.name !== 'index' || newContext.name === 'something else') {
      offset *= -1;
    }
    if (forNewView) {
      return {translateX: ["0%", offset + "%"]};
    } else {
      return {translateX: (offset * -1) + "%"};
    }
  },
  
  animateIn: function(){
    // If we're already entering, reuse the same promise because we
    // never do it twice.
    if (this._entering) {
      return this._entering;
    }

    // If we're already leaving or if we've been told not to animate
    // our entrance, do nothing.
    if (this._leaving || !this.get('entering')) {
      return Prom.cast(null);
    }

    console.log("I'm replacing " + logSpatialContext(this.get('replacingState')) + " with " + logSpatialContext(this.spatialContext()));
    
    var self = this;
    return this._entering = new Prom(function(resolve){
      //console.log("starting animateIn for", self.get('currentView.renderedName'));
      self.$().velocity(self.motionFor(true, self.get('replacingState'), self.spatialContext()), {duration: 250, complete: resolve});
    }).then(function(){
      //console.log("finished animateIn for", self.get('currentView.renderedName'))
    });
  }.on('didInsertElement'),

  animateOut: function(successor){
    if (this._leaving) {
      return this._leaving;
    }
    var self = this;    
    // We always chain this behind the entering promise, so that an
    // in-progress enter will be allowed to finish before we start
    // leaving. Animation libraries like jquery and velocity already
    // do queuing for animations on the same element, so in those
    // cases this is redundant but harmless.
    console.log("I'm being replaced by " + logSpatialContext(successor) + ", I had " + logSpatialContext(this.spatialContext()));    
    return this._leaving = Prom.cast(this._entering).then(function(){
      return new Prom(function(resolve) {

	self.$().velocity(self.motionFor(false, self.spatialContext(), successor), {duration: 250, complete: resolve});
      });
    }).then(function(){
      self.destroy();
    });
  }
  
});

export default Ember.ContainerView.extend({
  classNames: ['sticky-outlet'],

  // Should the old view leaving and the new view entering run in
  // parallel? Otherwise, they run in series.
  parallel: true,

  // Should we show an entrance animation when this outlet itself
  // first renders?
  animateFirstRender: false,
  
  init: function(){
    var currentView = this.get('currentView');
    if (currentView) {
      this.set('currentView', StickyChild.create({
	currentView: currentView,
	entering: this.get('animateFirstRender')
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
    var promises = [],
	children = this.get('childViews'),
	len      = children.get('length'),
	lastChild,
	replacingState;
    
    for (var i=0; i<len-1; i++) {
      // Ensure that all our earlier children are animating out, with
      // their directions relative to the view that followed them.
      promises.push(children.objectAt(i).animateOut(children.objectAt(i+1).spatialContext()));
    }
    
    if (len > 0) {
      // The last child view is our most-current child up until
      // now. Start animating it away, with a direction relative to
      // our new currentView.
      lastChild = children.objectAt(len-1);
      replacingState = lastChild.spatialContext();
      promises.push(lastChild.animateOut(spatialContext(this.get('currentView'))));
    }

    if (this.get('parallel')) {
      this._pushCurrent(replacingState);
    } else {
      var self = this;
      Ember.RSVP.allSettled(promises).then(function(){
	self._pushCurrent(replacingState);
      });
    }
  }),
  
  _pushCurrent: function(replacingState) {
    var currentView = this.get('currentView');
    if (currentView) {
      this.pushObject(StickyChild.create({currentView: currentView, replacingState: replacingState}));
    }
  }


});

function spatialContext(view) {
  return {
    context: view.get('context.content'),
    name: view.get('renderedName')
  };
}

function logSpatialContext(ctxt) {
  return ctxt.name + "(" + JSON.stringify(ctxt.context)+ ")";
}
