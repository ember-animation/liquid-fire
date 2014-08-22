import Promise from "./promise";

function Transition(parentView, oldView, newContent, animation, animationArgs, transitionMap) {
  this.parentView = parentView;
  this.oldView = oldView;
  this.newContent = newContent;
  this.animation = animation;
  this.animationArgs = animationArgs;
  this.transitionMap = transitionMap;
}

Transition.prototype = {
  run: function() {
    if (!this.animation) {
      this.maybeDestroyOldView();
      return this._insertNewView().then(revealView);
    }
    var self = this;
    self.transitionMap.activeCount += 1;
    return this._invokeAnimation().then(function(){
      self.maybeDestroyOldView();
    }, function(err){
      return self.cleanupAfterError().then(function(){
        throw err;
      });
    }).finally(function(){
      self.transitionMap.activeCount -= 1;
    });
  },

  _insertNewView: function() {
    if (this.inserted) {
      return this.inserted;
    }
    return this.inserted = this.parentView._pushNewView(this.newContent);
  },

  _goAbsolute: function() {
    var oldElt;
    this.parentView.lockSize();
    if (this.oldView && (oldElt = this.oldView.$())) {
      oldElt.css('position', 'absolute');
    }
  },

  _goStatic: function() {
    var elt;
    if (!this.interruptedLate) {
      if (this.newView && (elt = this.newView.$())) {
        this.newView.$().css('position', '');
      }
      this.parentView.unlockSize();
    }
  },

  _invokeAnimation: function() {
    this._goAbsolute();

    // The extra Promise means we will trap an exception thrown
    // immediately by the animation implementation.
    var self = this,
        animation = this.animation,
        inserter = function(){
          return self._insertNewView().then(function(newView){
            if (!newView) { return; }
            newView.$().css('position', 'absolute');
            self.parentView.adaptSize(newView.$().outerWidth(true),newView.$().outerHeight(true));
            return self.newView = newView;
          });
        },
        args = [this.oldView, inserter].concat(this.animationArgs);
    return new Promise(function(resolve, reject){
      animation.apply(self, args).then(resolve, reject);
    }).then(function(){self._goStatic();});
  },

  maybeDestroyOldView: function() {
    if (!this.interruptedEarly && this.oldView) {
      this.oldView.destroy();
    }
  },

  // If the animation blew up, do what we can to leave the DOM in a
  // sane state before re-propagating the error.
  cleanupAfterError: function() {
    this.maybeDestroyOldView();
    return this._insertNewView().then(revealView);
  },

  interrupt: function(){
    // If we haven't yet inserted the new view, don't. And tell the
    // old view not to destroy when our animation stops, because the
    // next transition is going to take over and keep using it.
    if (!this.inserted) {
      this.inserted = Promise.cast(null);
      this.interruptedEarly = true;
    } else {
      this.interruptedLate = true;
    }
  },

  // Lets you compose your transitions out of other named transitions.
  lookup: function(transitionName) {
    return this.transitionMap.lookup(transitionName);
  }
};

function revealView(view) {
  var elt;
  if (view && (elt = view.$())) {
    elt.show();
  }
}



export default Transition;
