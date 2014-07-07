import Promise from "./promise";

function Transition(oldView, newContent, animation) {
  this.oldView = oldView;
  this.newContent = newContent;
  this.animation = animation;
}

Transition.prototype = {
  run: function(container) {
    if (!this.animation) {
      if (this.oldView) {
        this.oldView.destroy();
      }
      return container._pushNewView(this.newContent);
    }

    var self = this;
    function insertNewView() {
      if (self.inserted) {
        return self.inserted;
      }
      return self.inserted = container._pushNewView(self.newContent);
    }
    return this.animation(this.oldView, insertNewView).then(function(){
      self.maybeDestroyOldView();
    });
  },

  maybeDestroyOldView: function(){
    if (!this.interrupted && this.oldView) {
      this.oldView.destroy();
    }
  },

  interrupt: function(){
    // If we haven't yet inserted the new view, don't. And tell the
    // old view not to destroy when our animation stops, because the
    // next transition is going to take over and keep using it.
    if (!this.inserted) {
      this.inserted = Promise.cast(null);
      this.interrupted = true;
    }
  }
};

export default Transition;
