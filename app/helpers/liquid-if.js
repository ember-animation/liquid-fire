export default {
    isHTMLBars: true,
    helperFunction: function liquidFireHelper(params, hash, options, env) {
      var componentLookup = this.container.lookup('component-lookup:main');
      var cls = componentLookup.lookupFactory('liquid-if');
      hash.value = params[0];
      if (hash['class']) {
        hash.innerClass = hash['class'];
        delete hash['class'];
      }
      hash.tagName = "";
      hash.inverseTemplate = options.inverse;
      env.helpers.view.helperFunction.call(this, [cls], hash, options, env);
    }
};
