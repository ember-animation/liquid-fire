import Ember from "ember";
var Router = Ember.Router;
var proto = Ember.RouterDSL.prototype;

var currentMap = null;

proto.modal = function(componentName, opts) {

  Ember.assert('modal("' + componentName + '",...) needs a `withParams` argument', opts && opts.withParams);

  opts = Ember.copy(opts);

  opts.withParams  = expandParamOptions(opts.withParams);
  opts.otherParams = expandParamOptions(opts.otherParams);

  if (typeof(opts.dismissWithOutsideClick) === 'undefined') {
    opts.dismissWithOutsideClick = true;
  }

  if (typeof(opts.dismissWithEscape) === 'undefined') {
    opts.dismissWithEscape = true;
  }

  currentMap.push({
    route: this.parent,
    name: componentName,
    options: opts
  });
};

// 1.10 and above
Router.reopen({
  _initRouterJs: function() {
    currentMap = [];
    this._super();
    this.router.modals = currentMap;
  }
});

// 1.9 and below
var origMap = Router.map;
Router.reopenClass({
  map: function() {
    currentMap = [];
    var output = origMap.apply(this, arguments);
    if (this.router) {
      this.router.modals = currentMap;
    }
    return output;
  }
});


// takes string, array of strings, object, or array of objects and strings
// and turns them into one object to map withParams/otherParams from context to modal
//
// "foo"                   => { foo: "foo" }
// ["foo"]                 => { foo: "foo" }
// { foo: "bar" }          => { foo: "bar" }
// ["foo", { bar: "baz" }] => { foo: "foo", bar: "baz" }
//
function expandParamOptions(options) {
  if (!options) { return {}; }

    if (!Ember.isArray(options)) {
      options = [options];
    }

    var params = {};
    var option, i, key;

    for (i = 0; i < options.length; i++) {
      option = options[i];
      if (typeof option === "object") {
        for (key in option) {
          params[key] = option[key];
        }
      } else {
        params[option] = option;
      }
    }

    return params;
  }