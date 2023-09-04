import Component from '@glimmer/component';
import { action, set } from '@ember/object';
import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { guidFor } from '@ember/object/internals';
import './liquid-versions.css';

export default class LiquidVersionsComponent extends Component {
  @service('liquid-fire-transitions') transitionMap;

  @tracked versions = null;

  @action
  appendVersion() {
    let versions = this.versions;
    let firstTime = false;
    const newValue = this.args.value;
    let oldValue;
    const versionEquality = this.args.versionEquality || defaultEqualityCheck;

    if (!versions) {
      firstTime = true;
      versions = A();
      this.uniqueChildId = guidFor(this);
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
    const newVersion = {
      value: newValue,
      uniqueChildId: this.uniqueChildId,
    };
    versions.unshiftObject(newVersion);

    this.firstTime = firstTime;
    if (firstTime) {
      set(this, 'versions', versions);
    }

    if (!(newValue || this.args.renderWhenFalse || firstTime)) {
      this._transition();
    }
  }

  _transition() {
    assert(
      `LiquidVersions: @containerElement is required!`,
      !!this.args.containerElement,
    );

    const versions = this.versions;
    const firstTime = this.firstTime;
    this.firstTime = false;

    this.notifyContainer('afterChildInsertion', versions);

    const transition = this.transitionMap.transitionFor({
      versions: versions,
      parentElement: this.args.containerElement,
      use: this.args.use,
      rules: this.args.rules,
      matchContext: this.args.matchContext || {},
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

    transition.run().then(
      (wasInterrupted) => {
        // if we were interrupted, we don't handle the cleanup because
        // another transition has already taken over.
        if (!wasInterrupted) {
          this.finalizeVersions(versions);
          this.notifyContainer('afterTransition', versions);
        }
      },
      (err) => {
        this.finalizeVersions(versions);
        this.notifyContainer('afterTransition', versions);
        throw err;
      },
    );
  }

  finalizeVersions(versions) {
    versions.replace(1, versions.length - 1);
  }

  notifyContainer(method, versions) {
    const target = this.args.notify;
    if (target && !target.isDestroying) {
      target[method](versions);
    }
  }

  @action
  childDidRender(child) {
    const version = child.args.version;
    set(version, 'view', child);
    this._transition();
  }
}

// All falsey values are considered equal, everything else gets strict
// equality.
function defaultEqualityCheck(a, b) {
  return (!a && !b) || a === b;
}
