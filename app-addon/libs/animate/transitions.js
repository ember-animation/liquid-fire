import Transition from "./transition";

function Transitions() {
  this._namedTransitions = {};
  this._map = {};
}

Transitions.prototype = {
  
  defineTransition: function(name, handler) {
    this._namedTransitions[name] = handler;
  },

  from: function(name) {
    var context = Object.create(this);
    context._from = name;
    return context;
  },

  to: function(name) {
    var context = Object.create(this);
    context._to = name;
    return context;
  },

  use: function(nameOrHandler) {
    var from = this._from || '__default__',
	to   = this._to   || '__default__';
    if (!this._map[from]) {
      this._map[from] = {};
    }
    this._map[from][to] = nameOrHandler;
    return this;
  },

  lookup: function(oldView, newContent) {
    var ctxt = this._map[oldView.get('currentView.renderedName')] || this._map['__default__'] || {},
	key = ctxt[newContent.get('renderedName')] || ctxt['__default__'],
	handler;
    
    if (key && typeof(key) === 'function') {
      handler = key;
    } else if (key) {
      handler = this._namedTransitions[key];
      if (!handler) {
	throw new Error("unknown transition name: " + key);
      }
    }
    return new Transition(oldView, newContent, handler);
  }
};

Transitions.map = function(handler) {
  var t = new Transitions();
  handler.apply(t);
  return t;
};

export default Transitions;
