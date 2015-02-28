import { makeHelperShim } from "liquid-fire/ember-internals";
export default makeHelperShim('liquid-if', function(params, hash, options) {
  hash.inverseTemplate = options.inverse;
});
