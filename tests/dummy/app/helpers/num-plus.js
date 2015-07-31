import Ember from 'ember';

export function plusHelper(params) {
  return parseInt(params[0]) + parseInt(params[1]);
}

export default Ember.Helper.helper(plusHelper);
