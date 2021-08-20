import Component from '@ember/component';
import Growable from 'liquid-fire/mixins/growable';
import { measure } from './liquid-measured';
import layout from 'liquid-fire/templates/components/liquid-container';
import $ from 'jquery';

export default Component.extend(Growable, {
  layout,
  classNames: ['liquid-container'],

  lockSize(elt, want) {
    elt.outerWidth(want.width);
    elt.outerHeight(want.height);
  },

  unlockSize() {
    let doUnlock = () => {
      this.updateAnimatingClass(false);
      if (this.element) {
        this.element.style.width = '';
        this.element.style.height = '';
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
  updateAnimatingClass(on) {
    if (this.isDestroyed) {
      return;
    }
    if (on) {
      this.element.classList.add('liquid-animating');
    } else {
      this.element.classList.remove('liquid-animating');
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._wasInserted = true;
  },

  actions: {
    willTransition(versions) {
      if (!this._wasInserted) {
        return;
      }

      // Remember our own size before anything changes
      let elt = $(this.element);
      this._cachedSize = measure(elt);

      // And make any children absolutely positioned with fixed sizes.
      for (let i = 0; i < versions.length; i++) {
        goAbsolute(versions[i]);
      }
    },

    afterChildInsertion(versions) {
      let elt = $(this.element);
      let enableGrowth = this.enableGrowth !== false;

      // Measure children
      let sizes = [];
      for (let i = 0; i < versions.length; i++) {
        if (versions[i].view) {
          let childElt = $(versions[i].view.element);
          sizes[i] = measure(childElt);
        }
      }

      // Measure ourself again to see how big the new children make
      // us.
      let want = measure(elt);
      let have = this._cachedSize || want;

      // Make ourself absolute
      if (enableGrowth) {
        this.lockSize(elt, have);
      } else {
        this.lockSize(elt, {
          height: Math.max(want.height, have.height),
          width: Math.max(want.width, have.width),
        });
      }

      // Apply '.liquid-animating' to liquid-container allowing
      // any customizable CSS control while an animating is occuring
      this.updateAnimatingClass(true);

      // Make the children absolute and fixed size.
      for (let i = 0; i < versions.length; i++) {
        goAbsolute(versions[i], sizes[i]);
      }

      // Kick off our growth animation
      if (enableGrowth) {
        this._scaling = this.animateGrowth(elt, have, want);
      }
    },

    afterTransition(versions) {
      for (let i = 0; i < versions.length; i++) {
        goStatic(versions[i]);
      }
      this.unlockSize();
    },
  },
});

function goAbsolute(version, size) {
  if (!version.view) {
    return;
  }
  let elt = $(version.view.element);
  let pos = elt.position();
  if (!size) {
    size = measure(elt);
  }
  elt.outerWidth(size.width);
  elt.outerHeight(size.height);
  elt.css({
    position: 'absolute',
    top: pos.top,
    left: pos.left,
  });
}

function goStatic(version) {
  if (version.view && !version.view.isDestroyed) {
    let elt = $(version.view.element);
    elt.css({ width: '', height: '', position: '' });
  }
}
