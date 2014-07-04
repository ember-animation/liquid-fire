var StickyChild = Ember.ContainerView.extend({
  classNames: ['sticky-child'],
  classNameBindings: ['entering', 'leaving'],
  entering: true,
  
  leaving: Ember.computed(function(){
    var parentCurrentView = this.get('parentView.currentView');
    return this !== parentCurrentView && this.get('currentView') !== parentCurrentView;
  }).property('parentView.currentView'),

  didInsertElement: function(){
    var self = this;
    this.$().on('transitionEnd webkitTransitionEnd', function(){
      if (self.get('leaving')) {
	self.destroy();
      }
    });
    Ember.run.next(function(){
      self.set('entering', false);
    });
  }
});

export default Ember.ContainerView.extend({
  classNames: ['sticky-outlet'],


  init: function(){
    var currentView = this.get('currentView');
    if (currentView) {
      this.set('currentView', StickyChild.create({currentView: currentView, entering: false}));
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
  //
  // We need to wrap our new child in our helper view.
  _currentViewDidChange: Ember.observer('currentView', function() {
    var currentView = this.get('currentView');
    if (currentView) {
      this.pushObject(StickyChild.create({currentView: currentView}));
    }
  })


});
