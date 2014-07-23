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
        throw new Error("cannot combine empty context matcher with any other constraints");
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
      this.fromRoute(arguments),
      this.toRoute(arguments)
    ];
  },

  fromContext: function(matcher) {
    return {
      side: 'from',
      type: 'context',
      payload: contextMatcher(matcher)
    };
  },

  toContext: function(matcher) {
    return {
      side: 'to',
      type: 'context',
      payload: contextMatcher(matcher)
    };
  },

  between: function(matcher) {
    return [
      this.fromContext(matcher),
      this.toContext(matcher)
    ];
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
  if (matcher.class) {
    return function(change) {
      return change.parentView.get('classNames').indexOf(matcher.class) !== -1;
    };
  }

  if (matcher.childOf) {
    return function(change) {
      /* global Ember */
      return Ember.$('#' + change.parentView.morph.start).parent().is(matcher.childOf);
    };
  }

  throw new Error("unknown context matcher: " + JSON.stringify(matcher));
}

export default DSL;
