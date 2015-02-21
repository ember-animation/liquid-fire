export default {
  isHTMLBars: true,
  helperFunction: function liquidBindHelper(params, hash, options, env) {
    var componentLookup = this.container.lookup('component-lookup:main');
    var cls = componentLookup.lookupFactory('liquid-bind-c');
    hash.value = params[0];
    if (hash['class']) {
      hash.innerClass = hash['class'];
      delete hash['class'];
    }
    env.helpers.view.helperFunction.call(this, [cls], hash, options, env);
  }
};
