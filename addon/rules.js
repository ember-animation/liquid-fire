import Ember from "ember";

export class Rule {
  constructor() {
    this.constraints = [];
    this.use = null;
    this.reverse = null;
    this.debug = false;
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

  validate() {
    if (!this.use) {
      throw new Error(`Every transition rule must include a "use" statement`);
    }
  }
}

// Every rule constraint has a target and either `keys` or
// `predicate`. key-based constraints are cheaper, because we can just
// do an O(1) lookup see which constraints may match given
// transition. Predicate-based constraints must be searched instead.
export class Constraint {
  constructor(target, matcher) {
    // targets are the properties of a transition that we can
    // constrain, like "fromRoute", "toValue", etc.
    this.target = target;

    if (typeof matcher === 'undefined') {
      this.keys = [ Constraint.EMPTY ];
    } else if (matcher instanceof RegExp) {
      this.predicate = function(value) { return matcher.test(value); };
    } else if (typeof matcher === 'function') {
      this.predicate = matcher;
    } else if (Ember.isArray(matcher)) {
      this.keys = matcher;
    } else {
      this.keys = [ matcher ];
    }
  }
}

Constraint.EMPTY = {};

export class Action {
  constructor(nameOrHandler, opts={}) {
    if (typeof nameOrHandler === 'function') {
      this.handler = nameOrHandler;
    } else {
      this.name = nameOrHandler;
    }
    this.reversed = opts.reversed;
  }
}
