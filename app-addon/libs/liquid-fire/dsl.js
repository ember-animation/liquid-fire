import { setDefaults } from "./animate";

function DSL(map) {
  this.map = map;
}

DSL.prototype = {
  setDefault: function(props) {
    setDefaults(props);
  },

  define: function(name, handler) {
    this.map._namedTransitions[name] = handler;
  },

  _withEmpty: function(elt){
    return elt || DSL.EMPTY;
  },

  _combineMatchers: function(matchers) {
    return [matchers.reduce(function(a,b){
      if (typeof(a) !== "function" || typeof(b) !== "function") {
        throw new Error("cannot combine empty model matcher with any other constraints");
      }

      return function(){
        return a.apply(this, arguments) && b.apply(this, arguments);
      };
    })];
  },

  transition: function() {
    var action,
        routes = {},
        contexts = {},
        args = Array.prototype.slice.apply(arguments).reduce(function(a,b){
          return a.concat(b);
        }, []);


    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (arg.type === 'action') {
        if (action) {
          throw new Error("each transition definition must contain exactly one 'use' statement");
        }
        action = { method: arg.payload, args: arg.args };
      } else if (arg.type === 'route') {
        if (routes[arg.side]) {
          throw new Error("A transition definition contains multiple constraints on " + arg.side + "Route");
        }
        routes[arg.side] = arg.payload.map(this._withEmpty);
      } else {
        if (!contexts[arg.side]){
          contexts[arg.side] = [];
        }
        contexts[arg.side].push(arg.payload);
      }
    }

    if (!action) {
      throw new Error("a transition definition contains no 'use' statement");
    }

    if (!routes.from) {
      routes.from = [DSL.ANY];
    }
    if (!routes.to) {
      routes.to = [DSL.ANY];
    }
    if (!contexts.from) {
      contexts.from = [DSL.ANY];
    }
    if (!contexts.to) {
      contexts.to = [DSL.ANY];
    }

    contexts.from = this._combineMatchers(contexts.from);
    contexts.to = this._combineMatchers(contexts.to);

    this.map.register(routes, contexts, action);
  },

  fromRoute: function() {
    return {
      side: 'from',
      type: 'route',
      payload: Array.prototype.slice.apply(arguments)
    };
  },

  toRoute: function() {
    return {
      side: 'to',
      type: 'route',
      payload: Array.prototype.slice.apply(arguments)
    };
  },

  withinRoute: function() {
    return [
      this.fromRoute.apply(this, arguments),
      this.toRoute.apply(this, arguments)
    ];
  },

  fromModel: function(matcher) {
    return {
      side: 'from',
      type: 'context',
      payload: contextMatcher(matcher)
    };
  },

  toModel: function(matcher) {
    return {
      side: 'to',
      type: 'context',
      payload: contextMatcher(matcher)
    };
  },

  betweenModels: function(matcher) {
    return [
      this.fromModel(matcher),
      this.toModel(matcher)
    ];
  },

  hasClass: function(name) {
    return this.betweenModels(function(change) {
      return change.parentView.get('classNames').indexOf(name) !== -1;
    });
  },

  childOf: function(selector) {
    return this.betweenModels(function(change) {
      /* global Ember */
      return Ember.$('#' + change.parentView.morph.start).parent().is(selector);
    });
  },

  fromNonEmptyModel: function(){
    return this.fromModel(function(){
      return !!this;
    });
  },

  toNonEmptyModel: function(){
    return this.toModel(function(){
      return !!this;
    });
  },

  betweenNonEmptyModels: function(){
    return this.betweenModels(function(){
      return !!this;
    });
  },

  use: function(nameOrHandler) {
    return {
      type: 'action',
      payload: nameOrHandler,
      args: Array.prototype.slice.apply(arguments, [1])
    };
  }
};

DSL.ANY = '__liquid-fire-ANY';
DSL.EMPTY = '__liquid-fire-EMPTY';

function contextMatcher(matcher) {
  if (!matcher) {
    return DSL.EMPTY;
  }

  if (typeof(matcher) === 'function') {
    return matcher;
  }
  if (matcher.instanceOf) {
    return function() {
      return (this instanceof matcher.instanceOf) || (this && this.get && this.get('model') && this.get('model') instanceof matcher.instanceOf);
    };
  }

  throw new Error("unknown context matcher: " + JSON.stringify(matcher));
}

export default DSL;
