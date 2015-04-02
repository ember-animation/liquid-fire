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

  actions: {

    willTransition: function(versions) {
      if (!this._wasInserted) {
        return;
      }

      // Remember our own size before anything changes
      var elt = this.$();
      this._cachedSize = measure(elt);

      // And make any children absolutely positioned with fixed sizes.
      for (var i = 0; i < versions.length; i++) {
        goAbsolute(versions[i]);
      }
    },

    afterChildInsertion: function(versions) {
      var elt = this.$();

      // Measure  children
      var sizes = [];
      for (var i = 0; i < versions.length; i++) {
        if (versions[i].view) {
          sizes[i] = measure(versions[i].view.$());
        }
      }

      // Measure ourself again to see how big the new children make
      // us.
      var want = measure(elt);
      var have = this._cachedSize || want;

      // Make ourself absolute
      this.lockSize(elt, have);

      // Make the children absolute and fixed size.
      for (i = 0; i < versions.length; i++) {
        goAbsolute(versions[i], sizes[i]);
      }

      // Kick off our growth animation
      this._scaling = this.animateGrowth(elt, have, want);
    },

    afterTransition: function(versions) {
      for (var i = 0; i < versions.length; i++) {
        goStatic(versions[i]);
      }
      this.unlockSize();
    }
  }
});

function goAbsolute(version, size) {
  if (!version.view) {
    return;
  }
  var elt = version.view.$();
  var pos = elt.position();
  if (!size) {
    size = measure(elt);
  }
  elt.outerWidth(size.width);
  elt.outerHeight(size.height);
  elt.css({
    position: 'absolute',
    top: pos.top,
    left: pos.left
  });
}

function goStatic(version) {
  if (version.view) {
    version.view.$().css({width: '', height: '', position: ''});
  }
}
