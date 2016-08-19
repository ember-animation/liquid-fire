import Ember from 'ember';
import { withLockedModel } from 'liquid-fire/ember-internals';

export default Ember.Helper.extend({
  compute(params, { outletState, outletName }) {
    return {
      outletState,
      childOutletState: withLockedModel(outletState.outlets[outletName])
    };
  }
});
