import { makeHelperShim } from "liquid-fire/ember-internals";
export default makeHelperShim('liquid-if', function(params, hash, options) {
  hash.helperName = 'liquid-unless';
  hash.inverseTemplate = options.template;
  options.template = options.inverse;
});
