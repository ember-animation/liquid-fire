import { makeHelperShim } from "liquid-fire/ember-internals";
export default makeHelperShim('liquid-outlet', function(params, hash){
  hash._outletName = params[0] || "main";
});
