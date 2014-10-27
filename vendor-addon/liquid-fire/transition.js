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
    if (this._ran) {
      return this._ran;
    }
    if (!this.animation) {
      this.maybeDestroyOldView();
      return this._ran = this._insertNewView().then(revealView);
    }
    var self = this;
    self.transitionMap.activeCount += 1;
    return this._ran = this._invokeAnimation().then(function(){
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

  _invokeAnimation: function() {
    var self = this,
        animation = this.animation,
        inserter = function(){
          var contained = !self.parentView.get('containerless');
          if (contained) {
            self.parentView.cacheSize();
            goAbsolute(self.oldView);
          }
          return self._insertNewView().then(function(newView){
            if (!newView) {
              if (contained){
                self.parentView.adaptSize();
              }
            } else {
              newView.$().show();
              if (contained){
                // Measure newView size before parentView sets an explicit size.
                var size = getSize(newView);
                self.parentView.adaptSize();
                goAbsolute(newView, size);
              }
              return self.newView = newView;
            }
          });
        },
        args = [this.oldView, inserter].concat(this.animationArgs);

    // The extra Promise means we will trap an exception thrown
    // immediately by the animation implementation.
    return new Promise(function(resolve, reject){
      animation.apply(self, args).then(resolve, reject);
    }).then(function(){
      if (!self.interruptedLate) {
        goStatic(self.newView);
        self.parentView.unlockSize();
      }
    });
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
      this.inserted = Promise.resolve(null);
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
    elt.show().css({visibility: ''});
  }
}

function getSize(view) {
  var elt;
  if (view && (elt = view.$())) {
    return {
      width: elt.width(),
      height: elt.height()
    };
  }
}

function goAbsolute(view, size) {
  var elt;
  if (view && (elt = view.$())) {
    if (!size) {
      size = getSize(view);
    }
    elt.width(size.width);
    elt.height(size.height);
    elt.css({position: 'absolute'});
  }
}

function goStatic(view) {
  var elt;
  if (view && (elt = view.$())) {
    elt.css({width: '', height: '', position: ''});
  }
}



export default Transition;
