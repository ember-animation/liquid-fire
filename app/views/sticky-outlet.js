var StickyChild = Ember.ContainerView.extend({
  classNames: ['sticky-child'],
  entering: true,
  
  animateIn: function(){
    var duration = this.get('entering') ? 250 : 0,
	self = this;
    return new Ember.RSVP.Promise(function(resolve){
      console.log("starting animateIn for", self.get('currentView.renderedName'));
      self.$().velocity({translateX: ["0%", "100%"]}, {duration: duration, complete: resolve})
    }).then(function(){console.log("finished animateIn for", self.get('currentView.renderedName'))});
  }.on('didInsertElement'),

  animateOut: function(){
    if (this._leaving) {
      return this._leaving;
    }
    var self = this;
    return this._leaving = new Ember.RSVP.Promise(function(resolve) {
      console.log("starting animateOut for", self.get('currentView.renderedName'));
      self.$().velocity({translateX: '-100%'}, {duration: 250, complete: resolve})
    }).then(function(){ console.log("finished animateOut for ", self.get('currentView.renderedName')); self.destroy() });
  }
  
});

export default Ember.ContainerView.extend({
  classNames: ['sticky-outlet'],

  // Should the old view leaving and the new view entering run in
  // parallel? Otherwise, they run in series.
  parallel: true,
  
  init: function(){
    var currentView = this.get('currentView');
    if (currentView) {
      this.set('currentView', StickyChild.create({currentView: currentView, entering: false}));
    }
    this.set('inboundQueue', []);
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
    var promises = this.get('childViews').map(function(child) {
      return child.animateOut();
    });

    if (this.get('parallel')) {
      this._pushCurrent();
    } else {
      var self = this;
      Ember.RSVP.allSettled(promises).then(function(){
	self._pushCurrent();
      });
    }

  }),
  
  _pushCurrent: function() {
    var currentView = this.get('currentView');
    if (currentView) {
      this.pushObject(StickyChild.create({currentView: currentView}));
    }
  }


});
