// This initializer exists only to make sure that the following
// imports happen before the app boots.
import "liquid-fire/router-dsl-ext";
import { registerKeywords } from "liquid-fire/ember-internals";
registerKeywords();

export default {
  name: 'liquid-fire',
  initialize: function() {}
};
