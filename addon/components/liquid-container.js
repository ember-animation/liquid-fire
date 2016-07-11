import Ember from "ember";
import Growable from "liquid-fire/growable";
import { measure } from "./liquid-measured";
import layout from "liquid-fire/templates/components/liquid-container";

export default Ember.Component.extend(Growable, {
  layout,
  classNames: ['liquid-container'],

  lockSize: function(elt, want) {
    elt.outerWidth(want.width);
    elt.outerHeight(want.height);
  },

  unlockSize: function() {
    var doUnlock = () => {
      this.updateAnimatingClass(false);
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

  // We're doing this manually instead of via classNameBindings
  // because it depends on upward-data-flow, which generates warnings
  // under Glimmer.
  updateAnimatingClass(on){
    if (this.isDestroyed) {
      return;
    }
    if (on) {
      this.$().addClass('liquid-animating');
    } else {
      this.$().removeClass('liquid-animating');
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
      var enableGrowth = this.get('enableGrowth') !== false;

      // Measure children
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
      if (enableGrowth) {
        this.lockSize(elt, have);
      } else {
        this.lockSize(elt, {
          height: Math.max(want.height, have.height),
          width: Math.max(want.width, have.width)
        });
      }

      // Apply '.liquid-animating' to liquid-container allowing
      // any customizable CSS control while an animating is occuring
      this.updateAnimatingClass(true);

      // Make the children absolute and fixed size.
      for (i = 0; i < versions.length; i++) {
        goAbsolute(versions[i], sizes[i]);
      }

      // Kick off our growth animation
      if (enableGrowth) {
        this._scaling = this.animateGrowth(elt, have, want);
      }
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
  if (version.view && !version.view.isDestroyed) {
    version.view.$().css({width: '', height: '', position: ''});
  }
}
