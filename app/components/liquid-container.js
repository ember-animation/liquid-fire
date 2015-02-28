import Ember from "ember";
import Growable from "liquid-fire/growable";
import { measure } from "./liquid-measured";

export default Ember.Component.extend(Growable, {
  classNames: ['liquid-container'],

  lockSize: function(elt, want) {
    elt.outerWidth(want.width);
    elt.outerHeight(want.height);
  },

  unlockSize: function() {
    var doUnlock = () => {
      var elt = this.$();
      if (elt) {
        elt.css({width: '', height: ''});
      }
    };
    if (this._scaling) {
      this._scaling.then(doUnlock);
    } else {
      doUnlock();
    }
  },

  startMonitoringSize: Ember.on('didInsertElement', function() {
    this._wasInserted = true;
  }),

  willTransition: function(versions) {
    if (!this._wasInserted) {
      return;
    }

    // Remember our own size before anything changes
    var elt = this.$();
    this._cachedSize = measure(elt);

    // And make any children absolutely positioned with fixed sizes.
    for (var i = 0; i < versions.length; i++) {
      goAbsolute(versions[i].view.$());
    }
  },

  afterChildInsertion: function(versions) {
    var elt = this.$();

    // Measure any new children
    var sizes = [];
    for (var i = 0; i < versions.length; i++) {
      if (versions[i].isNew) {
        sizes[i] = measure(versions[i].view.$());
      }
    }

    // Measure ourself again to see how big the new children make
    // us.
    var want = measure(elt);
    var have = this._cachedSize || want;

    // Make ourself absolute
    this.lockSize(elt, have);

    // Make the new children absolute and fixed size.
    for (i = 0; i < versions.length; i++) {
      if (versions[i].isNew) {
        goAbsolute(versions[i].view.$(), sizes[i]);
      }
    }

    // Kick off our growth animation
    this._scaling = this.animateGrowth(elt, have, want);
  },

  afterTransition: function(versions) {
    for (var i = 0; i < versions.length; i++) {
      goStatic(versions[i].view.$());
    }
    this.unlockSize();
  }

});

function goAbsolute(elt, size) {
  if (!size) {
    size = measure(elt);
  }
  elt.outerWidth(size.width);
  elt.outerHeight(size.height);
  elt.css({
    position: 'absolute',
    top: 0,
    left: 0
  });
}

function goStatic(elt) {
  elt.css({width: '', height: '', position: ''});
}
