import Ember from 'ember';
import { constraintKeys } from './constraint';

export var constrainables = {
  oldValue : {
    reversesTo: 'newValue',
    accessor: versionValue(false)
  },
  newValue: {
    reversesTo: 'oldValue',
    accessor: versionValue(true)
  },
  helperName: {},
  parentElementClass: {
    accessor: function(conditions) {
      var cls = conditions.parentElement.attr('class');
      if (cls) {
        return cls.split(/\s+/);
      }
    }
  },
  parentElement: {},
  firstTime: {}
};

export default class Constraints {
  constructor() {
    this.targets = {};
    for (var i = 0; i < constrainableKeys.length; i++) {
      this.targets[constrainableKeys[i]] = {};
    }
  }

  addRule(rule) {
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
    debugger;
    // TODO: take most specific
    return this.match(conditions)[0];
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
        return context[keys[i]];
      }
    }
    return context[ANY] || {};
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

function versionValue(newFlag) {
  return function(versions) {
    var length = versions.length;
    var version;
    for (var i = 0; i < length; i++) {
      version = versions[i];
      if (newFlag ? version.isNew : !version.isNew) {
        return [version.value];
      }
    }
  };
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

var constrainableKeys = Ember.A(Ember.keys(constrainables));
var ANY = '__liquid_fire_ANY__';
