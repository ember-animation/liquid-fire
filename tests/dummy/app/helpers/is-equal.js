import Ember from 'ember';

export function equalHelper(params) {
  return params[0] === params[1];
}

export default Ember.Helper.helper(equalHelper);
