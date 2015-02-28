import Ember from "ember";
import Action from "./action";
import Constraint from "./constraint";

export default class Rule {
  constructor() {
    this.constraints = Ember.A();
    this.use = null;
    this.reverse = null;
  }

  add(thing) {
    if (thing instanceof Action) {
      var prop = 'use';
      if (thing.reversed) {
        prop = 'reverse';
      }
      if (this[prop]) {
        throw new Error(`More than one "${prop}" statement in the same transition rule is not allowed`);
      }
      this[prop] = thing;
    } else if (thing === 'debug') {
      this.debug = true;
    } else {
      this.constraints.push(thing);
    }
  }

  validate(transitionMap) {
    if (!this.use) {
      throw new Error(`Every transition rule must include a "use" statement`);
    }
    this.use.validateHandler(transitionMap);
    if (this.reverse) {
      this.reverse.validateHandler(transitionMap);
    }
    if (!this.constraints.find((c) => c.target === 'firstTime')) {
      this.constraints.push(new Constraint('firstTime', 'no'));
    }
  }

  invert() {
    var rule = new this.constructor();
    rule.use = this.reverse;
    rule.reverse = this.use;
    rule.constraints = this.constraints.map((c) => c.invert());
    rule.debug = this.debug;
    return rule;
  }
}
