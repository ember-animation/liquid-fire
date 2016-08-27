import Ember from 'ember';

export function lfOr(params/*, hash*/) {
  return params.reduce((a,b) => a || b, false);
}

export default Ember.Helper.helper(lfOr);
