// This initializer exists only to make sure that the following
// imports happen before the app boots.
import { registerKeywords } from "liquid-fire/ember-internals";
registerKeywords();

export default {
  name: 'liquid-fire',
  initialize: function() {}
};
