import Transition from "./transition";
import predefinedTransitions from "./predefined_transitions";
import { setDefaults } from "./animate";

function Transitions() {
  this._namedTransitions = {};
  this._map = {};
  this.map(predefinedTransitions);
}

Transitions.prototype = {

  setDefault: function(props) {
    setDefaults(props);
  },
  
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
    var from = this._from || 'default',
        to   = this._to   || 'default';
    if (!this._map[from]) {
      this._map[from] = {};
    }
    this._map[from][to] = nameOrHandler;
    return this;
  },

  lookup: function(oldView, newContent) {
    var oldName, newName;
    if (oldView) {
      oldName = oldView.get('currentView.renderedName');
    } else {
      oldName = "empty";
    }
    if (newContent) {
      newName = newContent.get('renderedName');
    } else {
      newName = "empty";
    }

    var ctxt = this._map[oldName] || this._map['default'] || {},
        key = ctxt[newName] || ctxt['default'],
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
  },

  map: function(handler) {
    if (handler){
      handler.apply(this);
    }
    return this;
  }
    
};

Transitions.map = function(handler) {
  var t = new Transitions();
  t.map(handler);
  return t;
};

export default Transitions;
