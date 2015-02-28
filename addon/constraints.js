import Ember from 'ember';
import { constraintKeys } from './constraint';
import constrainables from "./constrainables";

export default class Constraints {
  constructor() {
    this.targets = {};
    this.ruleCounter = 0;
    for (var i = 0; i < constrainableKeys.length; i++) {
      this.targets[constrainableKeys[i]] = {};
    }
  }

  addRule(rule) {
    rule.id = this.ruleCounter++;
    if (rule.debug) {
      this.debug = true;
    }
    this.addHalfRule(rule);
    if (rule.reverse) {
      var inverted = rule.invert();
      inverted.id = rule.id + ' reverse';
      this.addHalfRule(inverted);
    }
  }

  addHalfRule(rule) {
    var seen = {};
    rule.constraints.forEach((constraint) => {
      seen[constraint.target] = true;
      this.addConstraint(rule, constraint);
    });
    constrainableKeys.forEach((key) => {
      if (!seen[key]) {
        this.addConstraint(rule, { target: key });
      }
    });
  }

  addConstraint(rule, constraint) {
    var context = this.targets[constraint.target];
    if (!context) {
      throw new Error(`Unknown constraint target ${constraint.target}`);
    }
    if (constraint.keys) {
      constraint.keys.forEach((key) => {
        this.addKey(context, key, rule);
      });
    } else {
      this.addKey(context, ANY, rule);
    }
  }

  addKey(context, key, rule) {
    if (!context[key]) {
      context[key] = {};
    }
    context[key][Ember.guidFor(rule)] = rule;
  }

  bestMatch(conditions) {
    if (this.debug) {
      console.log("[liquid-fire] Checking transition rules for", conditions.parentElement[0]);
    }
    // TODO: take most specific
    var rules = this.match(conditions);
    var best = rules[0];

    if (rules.length > 1 && this.debug) {
      rules.forEach((rule) => {
        if (rule !== best && rule.debug) {
          console.log(`${describeRule(rule)} matched, but it was superceded by another rule`);
        }
      });
    }
    if (best && best.debug) {
      console.log(`${describeRule(best)} matched`);
    }
    return best;
  }

  match(conditions) {
    var rules = this.matchByKeys(conditions);
    rules = this.matchPredicates(conditions, rules);
    return rules;
  }

  matchByKeys(conditions) {
    var matchSets = [];
    for (var i = 0; i < constrainableKeys.length; i++) {
      var key = constrainableKeys[i];
      var value = conditionAccessor(conditions, key);
      matchSets.push(this.matchingSet(key, value));
    }
    return intersection(matchSets);
  }

  matchingSet(prop, value) {
    var keys = constraintKeys(value);
    var context = this.targets[prop];
    for (var i = 0; i < keys.length; i++) {
      if (context[keys[i]]) {
        this.logDebugRules(context, keys[i], `because ${prop}=${value}`);
        return context[keys[i]];
      }
    }
    this.logDebugRules(context, ANY, `because ${prop}=${value}`);
    return context[ANY] || {};
  }

  logDebugRules(context, matchedKey, reason) {
    if (!this.debug) {
      return;
    }
    Ember.A(Ember.keys(context)).forEach((key) => {
      Ember.A(Ember.keys(context[key])).forEach((ruleId) => {
        var rule = context[key][ruleId];
        if (rule.debug && key !== matchedKey) {
          console.log(`${describeRule(rule)} rejected ${reason}`);
        }
      });
    });
  }

  matchPredicates(conditions, rules) {
    var output = [];
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      var matched = true;
      for (var j = 0; j < rule.constraints.length; j++) {
        var constraint = rule.constraints[j];
        var value = conditionAccessor(conditions, constraint.target);
        if (constraint.predicate && !constraint.predicate(value)) {
          matched = false;
          if (rule.debug) {
            if (constraint.target === 'parentElement') {
              value = value[0];
            }
            console.log(`${describeRule(rule)} rejected because of a constraint on ${constraint.target}. ${constraint.target} was`, value);
          }
          break;
        }
      }
      if (matched) {
        output.push(rule);
      }
    }
    return output;
  }
}

function conditionAccessor(conditions, key) {
  var constrainable = constrainables[key];
  if (constrainable.accessor) {
    return constrainable.accessor(conditions);
  } else {
    return conditions[key];
  }
}

// Returns a list of property values from source whose keys also
// appear in all of the rest objects.
function intersection(sets) {
  var source = sets[0];
  var rest = sets.slice(1);
  var keys = Ember.keys(source);
  var keysLength = keys.length;
  var restLength = rest.length;
  var result = [];
  for (var keyIndex = 0; keyIndex < keysLength; keyIndex++) {
    var key = keys[keyIndex];
    var matched = true;
    for (var restIndex = 0; restIndex < restLength; restIndex++) {
      if (!rest[restIndex].hasOwnProperty(key)) {
        matched = false;
        break;
      }
    }
    if (matched) {
      result.push(source[key]);
    }
  }
  return result;
}

function describeRule(rule) {
  return `[liquid-fire rule ${rule.id}]`;
}

var constrainableKeys = Ember.A(Ember.keys(constrainables));
var ANY = '__liquid_fire_ANY__';
