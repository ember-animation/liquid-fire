/* eslint-disable no-console */

import { A } from '@ember/array';

import { guidFor } from '@ember/object/internals';
import { constraintKeys, EMPTY, ANY } from './constraint';
import constrainables from './constrainables';

export default class Constraints {
  constructor() {
    this.targets = {};
    this.ruleCounter = 0;
    for (let i = 0; i < constrainableKeys.length; i++) {
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
      let inverted = rule.invert();
      inverted.id = rule.id + ' reverse';
      this.addHalfRule(inverted);
    }
  }

  addHalfRule(rule) {
    let seen = {};
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
    let context = this.targets[constraint.target];
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
    context[key][guidFor(rule)] = rule;
  }

  bestMatch(conditions) {
    if (this.debug) {
      console.log(
        '[liquid-fire] Checking transition rules for',
        conditions.parentElement[0]
      );
    }

    let rules = this.match(conditions);
    let best = highestPriority(rules);

    if (rules.length > 1 && this.debug) {
      rules.forEach((rule) => {
        if (rule !== best && rule.debug) {
          console.log(
            `${describeRule(
              rule
            )} matched, but it was superceded by another rule`
          );
        }
      });
    }
    if (best && best.debug) {
      console.log(`${describeRule(best)} matched`);
    }
    return best;
  }

  match(conditions) {
    let rules = this.matchByKeys(conditions);
    rules = this.matchPredicates(conditions, rules);
    return rules;
  }

  matchByKeys(conditions) {
    let matchSets = [];
    for (let i = 0; i < constrainableKeys.length; i++) {
      let key = constrainableKeys[i];
      let value = conditionAccessor(conditions, key);
      matchSets.push(this.matchingSet(key, value));
    }
    return intersection(matchSets);
  }

  matchingSet(prop, value) {
    let keys = constraintKeys(value);
    let context = this.targets[prop];
    let matched = A();
    for (let i = 0; i < keys.length; i++) {
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
    A(Object.keys(context)).forEach((setKey) => {
      let set = context[setKey];
      A(Object.keys(set)).forEach((ruleKey) => {
        let rule = set[ruleKey];
        if (rule.debug && !matched[guidFor(rule)]) {
          console.log(
            `${describeRule(rule)} rejected because ${target} was`,
            ...value
          );
        }
      });
    });
  }

  matchPredicates(conditions, rules) {
    let output = [];
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i];
      let matched = true;
      for (let j = 0; j < rule.constraints.length; j++) {
        let constraint = rule.constraints[j];
        if (
          constraint.predicate &&
          !this.matchConstraintPredicate(conditions, rule, constraint)
        ) {
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
    let values = conditionAccessor(conditions, constraint.target);
    let reverse = constrainables[constraint.target].reversesTo;
    let inverseValues;
    if (reverse) {
      inverseValues = conditionAccessor(conditions, reverse);
    }
    for (let i = 0; i < values.length; i++) {
      if (
        constraint.predicate(values[i], inverseValues ? inverseValues[i] : null)
      ) {
        return true;
      }
    }
    if (rule.debug) {
      if (constraint.target === 'parentElement') {
        values = values.map((v) => v[0]);
      }
      console.log(
        `${describeRule(rule)} rejected because of a constraint on ${
          constraint.target
        }. ${constraint.target} was`,
        ...values
      );
    }
  }
}

function conditionAccessor(conditions, key) {
  let constrainable = constrainables[key];
  if (constrainable.accessor) {
    return constrainable.accessor(conditions) || [];
  } else {
    return [conditions[key]];
  }
}

// Returns a list of property values from source whose keys also
// appear in all of the rest objects.
function intersection(sets) {
  let source = sets[0];
  let rest = sets.slice(1);
  let keys = Object.keys(source);
  let keysLength = keys.length;
  let restLength = rest.length;
  let result = [];
  for (let keyIndex = 0; keyIndex < keysLength; keyIndex++) {
    let key = keys[keyIndex];
    let matched = true;
    for (let restIndex = 0; restIndex < restLength; restIndex++) {
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
  let setsLength = sets.length;
  let output = {};
  for (let i = 0; i < setsLength; i++) {
    let set = sets[i];
    let keys = Object.keys(set);
    for (let j = 0; j < keys.length; j++) {
      let key = keys[j];
      output[key] = set[key];
    }
  }
  return output;
}

function describeRule(rule) {
  return `[liquid-fire rule ${rule.id}]`;
}

function highestPriority(rules) {
  let best;
  let bestScore = 0;
  for (let i = 0; i < rules.length; i++) {
    let rule = rules[i];
    let score = rules[i].constraints.length;
    if (
      !best ||
      score > bestScore ||
      (score === bestScore && rule.id > best.id)
    ) {
      best = rule;
      bestScore = score;
    }
  }
  return best;
}

const constrainableKeys = A(Object.keys(constrainables));
