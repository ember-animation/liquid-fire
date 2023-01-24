import Component from '@ember/component';
import Growable from 'liquid-fire/mixins/growable';
import { measure } from './liquid-measured';
import layout from 'liquid-fire/templates/components/liquid-container';

export default Component.extend(Growable, {
  layout,
  classNames: ['liquid-container'],

  lockSize(elt, want) {
    elt.style.width = `${want.width}px`;
    elt.style.height = `${want.height}px`;
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
      this._cachedSize = measure(this.element);

      // And make any children absolutely positioned with fixed sizes.
      for (let i = 0; i < versions.length; i++) {
        goAbsolute(versions[i]);
      }
    },

    afterChildInsertion(versions) {
      let elt = this.element;
      let enableGrowth = this.enableGrowth !== false;

      // Measure children
      let sizes = [];
      for (let i = 0; i < versions.length; i++) {
        if (versions[i].view) {
          sizes[i] = measure(versions[i].view.element);
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
  let elt = version.view.element;
  let pos = {
    top: elt.offsetTop,
    left: elt.offsetLeft,
  };
  if (!size) {
    size = measure(elt);
  }
  elt.style.width = `${size.width}px`;
  elt.style.height = `${size.height}px`;
  elt.style.position = 'absolute';
  elt.style.top = `${pos.top}px`;
  elt.style.left = `${pos.left}px`;
}

function goStatic(version) {
  if (version.view && !version.view.isDestroyed) {
    let elt = version.view.element;
    elt.style.width = '';
    elt.style.height = '';
    elt.style.position = '';
  }
}
