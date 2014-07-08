import Transition from "./transition";
import DSL from "./dsl";
import predefinedTransitions from "./predefined_transitions";

function Transitions() {
  this._namedTransitions = {};
  this._map = {};
  this.map(predefinedTransitions);
}

Transitions.prototype = {

  lookup: function(transitionName) {
    var handler = this._namedTransitions[transitionName];
    if (!handler) {
      throw new Error("unknown transition name: " + transitionName);
    }
    return handler;
  },
  
  transitionFor: function(oldView, newContent) {
    var key = this.match(oldView, newContent),
        handler;
    
    if (key && typeof(key) === 'function') {
      handler = key;
    } else if (key) {
      handler = this.lookup(key);
    }
    return new Transition(oldView, newContent, handler, this);
  },

  map: function(handler) {
    if (handler){
      handler.apply(new DSL(this));
    }
    return this;
  },

  register: function(from, to, action) {
    this._register(this._map, [from.routes, to.routes, from.contexts, to.contexts], action);
  },
  
  _register: function(ctxt, remaining, payload) {
    var first = remaining[0];
    for (var i = 0; i < first.length; i++) {
      var elt = first[i];
      if (typeof(elt) === 'function') {
        if (!ctxt.__functions) {
          ctxt.__functions = [];
        }
        if (remaining.length === 1) {
          ctxt.__functions.push([elt, payload]);
        } else {
          var c = {};
          this._register(c, remaining.slice(1), payload);
          ctxt.__functions.push([elt, c]);
        }
      } else {
        if (remaining.length === 1) {
          ctxt[elt] = payload;
        } else {
          if (!ctxt[elt]) {
            ctxt[elt] = {};
          }
          this._register(ctxt[elt], remaining.slice(1), payload);
        }
      }
    }
  },

  _viewProperties: function(view, childProp) {
    if (view && childProp) {
      view = view.get(childProp);
    }
    
    if (!view) {
      return {
        route: 'empty',
        context: 'empty'
      };
    }
    
    var context;
    if (view.get('templateName') === 'liquid-with') {
      context = view.get('boundContext');
    } else {
      context = view.get('context');
    }

    return {
      route: view.get('renderedName'),
      context: context
    };
  },
  
  match: function(oldView, newContent) {
    var oldProps = this._viewProperties(oldView, 'currentView'),
        newProps = this._viewProperties(newContent);
    console.log("matching", oldProps, newProps);
    return this._match(this._map, [oldProps.route, newProps.route, oldProps.context, newProps.context]);
  },
  
  _match: function(ctxt, remaining) {
    var next = ctxt[remaining[0]] || ctxt[DSL.ANY];
    if (!next){
      next = this._matchFunctions(ctxt, remaining);
    }
    if (!next) {
      return;
    }
    if (remaining.length === 1){
      return next;
    } else {
      return this._match(next, remaining.slice(1));
    }
  },

  _matchFunctions: function(ctxt, remaining) {
    var first = remaining[0],
        fs = ctxt.__functions,
        len, i, candidate;
    
    if (!fs){ return; }
    for (i = 0, len = fs.length; i < len; i++) {
      candidate = fs[i];
      if (candidate[0].apply(first)) {
        return candidate[1];
      }
    }
  }
  
    
};


Transitions.map = function(handler) {
  var t = new Transitions();
  t.map(handler);
  return t;
};

export default Transitions;
