import { makeHelperShim } from "liquid-fire/ember-internals";
export default makeHelperShim('liquid-if', function(params, hash, options) {
  hash.helperName = 'liquid-if';
  hash.inverseTemplate = options.inverse;
});
