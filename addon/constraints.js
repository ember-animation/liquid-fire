/* globals console */

import Ember from 'ember';
import { constraintKeys, EMPTY, ANY } from './constraint';
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

    var rules = this.match(conditions);
    var best = highestPriority(rules);

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
    var matched = Ember.A();
    for (var i = 0; i < keys.length; i++) {
      if (context[keys[i]]) {
        matched.push(context[keys[i]]);
      }
    }
    if (keys.length === 0 && context[EMPTY]) {
      matched.push(context[EMPTY]);
    }
    if (context[ANY]) {
      matched.push(context[ANY]);
    }
    matched = union(matched);
    if (this.debug) {
      this.logDebugRules(matched, context, prop, value);
    }
    return matched;
  }

  logDebugRules(matched, context, target, value) {
    Ember.A(Object.keys(context)).forEach((setKey) => {
      var set = context[setKey];
      Ember.A(Object.keys(set)).forEach((ruleKey) => {
        var rule = set[ruleKey];
        if (rule.debug && !matched[Ember.guidFor(rule)]) {
          console.log(`${describeRule(rule)} rejected because ${target} was`, ...value);
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
        if (constraint.predicate && !this.matchConstraintPredicate(conditions, rule, constraint)) {
          matched = false;
          break;
        }
      }
      if (matched) {
        output.push(rule);
      }
    }
    return output;
  }

  matchConstraintPredicate(conditions, rule, constraint) {
    var values = conditionAccessor(conditions, constraint.target);
    var reverse = constrainables[constraint.target].reversesTo;
    var inverseValues;
    if (reverse) {
      inverseValues = conditionAccessor(conditions, reverse);
    }
    for (var i = 0; i < values.length; i++) {
      if (constraint.predicate(values[i], inverseValues ? inverseValues[i] : null)) {
        return true;
      }
    }
    if (rule.debug) {
      if (constraint.target === 'parentElement') {
        values = values.map((v)=>v[0]);
      }
      console.log(`${describeRule(rule)} rejected because of a constraint on ${constraint.target}. ${constraint.target} was`, ...values);
    }
  }
}

function conditionAccessor(conditions, key) {
  var constrainable = constrainables[key];
  if (constrainable.accessor) {
    return constrainable.accessor(conditions) || [];
  } else {
    return [conditions[key]];
  }
}

// Returns a list of property values from source whose keys also
// appear in all of the rest objects.
function intersection(sets) {
  var source = sets[0];
  var rest = sets.slice(1);
  var keys = Object.keys(source);
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

function union(sets) {
  var setsLength = sets.length;
  var output = {};
  for (var i = 0; i < setsLength; i++) {
    var set = sets[i];
    var keys = Object.keys(set);
    for (var j = 0; j < keys.length; j++) {
      var key = keys[j];
      output[key] = set[key];
    }
  }
  return output;
}

function describeRule(rule) {
  return `[liquid-fire rule ${rule.id}]`;
}

function highestPriority(rules) {
  var best;
  var bestScore = 0;
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    var score = rules[i].constraints.length;
    if (!best || score > bestScore || (score === bestScore && rule.id > best.id)) {
      best = rule;
      bestScore = score;
    }
  }
  return best;
}

var constrainableKeys = Ember.A(Object.keys(constrainables));
