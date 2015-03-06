import Ember from 'ember';

export function plusHelper(params) {
  return parseInt(params[0]) + parseInt(params[1]);
}

export default Ember.HTMLBars.makeBoundHelper(plusHelper);
