import $ from 'jquery';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { get, set } from '@ember/object';
import { containingElement } from "liquid-fire/ember-internals";
import layout from 'liquid-fire/templates/components/liquid-versions';

export default Component.extend({
  layout,
  tagName: "",

  transitionMap: service('liquid-fire-transitions'),

  didReceiveAttrs() {
    this._super(...arguments);
    this.appendVersion();
  },

  appendVersion() {
    let versions = this.versions;
    let firstTime = false;
    let newValue = this.getAttr('value');
    let oldValue;
    let versionEquality = this.get('versionEquality') || defaultEqualityCheck;

    if (!versions) {
      firstTime = true;
      versions = A();
    } else {
      if (versions[0]) {
        oldValue = versions[0].value;
      }
    }

    if (!firstTime && versionEquality(oldValue, newValue)) {
      if (versions[0] && versionEquality !== defaultEqualityCheck) {
        // When using custom equality checkers, we may consider values
        // equal for our purposes that are not `===`. In that case, we
        // still need to thread updated values through to our children
        // so they have their own opportunity to react.
        set(versions[0], 'value', newValue);
      }
      return;
    }

    this.notifyContainer('willTransition', versions);
    let newVersion = {
      value: newValue
    };
    versions.unshiftObject(newVersion);

    this.firstTime = firstTime;
    if (firstTime) {
      set(this, 'versions', versions);
    }

    if (!(newValue || this.get('renderWhenFalse') || firstTime)) {
      this._transition();
    }
  },

  _transition() {
    let versions = get(this, 'versions');
    let transition;
    let firstTime = this.firstTime;
    this.firstTime = false;


    this.notifyContainer('afterChildInsertion', versions);

    transition = get(this, 'transitionMap').transitionFor({
      versions: versions,
      parentElement: $(containingElement(this)),
      use: get(this, 'use'),
      rules: get(this, 'rules'),
      matchContext: get(this, 'matchContext') || {},
      // Using strings instead of booleans here is an
      // optimization. The constraint system can match them more
      // efficiently, since it treats boolean constraints as generic
      // "match anything truthy/falsy" predicates, whereas string
      // checks are a direct object property lookup.
      firstTime: firstTime ? 'yes' : 'no',
    });

    if (this._runningTransition) {
      this._runningTransition.interrupt();
    }
    this._runningTransition = transition;

    transition.run().then((wasInterrupted) => {
      // if we were interrupted, we don't handle the cleanup because
      // another transition has already taken over.
      if (!wasInterrupted) {
        this.finalizeVersions(versions);
        this.notifyContainer("afterTransition", versions);
      }
    }, (err) => {
      this.finalizeVersions(versions);
      this.notifyContainer("afterTransition", versions);
      throw err;
    });

  },

  finalizeVersions(versions) {
    versions.replace(1, versions.length - 1);
  },

  notifyContainer(method, versions) {
    let target = get(this, 'notify');
    if (target && !target.get('isDestroying')) {
      target.send(method, versions);
    }
  },

  actions: {
    childDidRender(child) {
      let version = get(child, 'version');
      set(version, 'view', child);
      this._transition();
    }
  }

});

// All falsey values are considered equal, everything else gets strict
// equality.
function defaultEqualityCheck(a, b) {
  return (!a && !b) || a === b;
}
