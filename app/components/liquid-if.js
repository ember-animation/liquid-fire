import Ember from 'ember';
import { inverseYieldMethod } from "liquid-fire/ember-internals";

export default Ember.Component.extend({
  _yieldInverse: inverseYieldMethod
});
