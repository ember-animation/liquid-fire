import Ember from 'ember';

export var targets = [
  'oldValue',
  'newValue',
  'helperName',
  'elementClass',
  'element'
];


export default class Constraints {
  constructor() {
    this.targets = {};
    for (var i = 0; i < targets.length; i++) {
      this.targets[targets[i]] = {};
    }
  }

  addRule(rule) {
    var seen = {};
    for (var i = 0; i < rule.constraints.length; i++) {
      seen[rule.constraints[i].target] = true;
      this.addConstraint(rule, rule.constraints[i]);
    }
    for (i = 0; i < targets.length; i++) {
      if (!seen[targets[i]]) {
        this.addConstraint(rule, { target: targets[i] });
      }
    }
  }

  addConstraint(rule, constraint) {
    var context = this.targets[constraint.target];
    if (!context) {
      throw new Error(`Unknown constraint target ${constraint.target}`);
    }
    if (constraint.keys) {
      for (var i = 0; i < constraint.keys.length; i++) {
        this.addKey(context, constraint.keys[i], rule);
      }
    } else {
      this.addKey(context, '__liquid_fire_ANY__', rule);
    }
  }

  addKey(context, key, rule) {
    if (!context[key]) {
      context[key] = {};
    }
    context[key][Ember.guidFor(rule)] = rule;
  }

  match(conditions) {

  }
}
