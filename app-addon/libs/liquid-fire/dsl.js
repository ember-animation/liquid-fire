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

  transition: function() {
    var action,
        from = { routes: [], contexts: [] },
        to = { routes: [], contexts: [] }   ; 

    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (arg.type === 'action') {
        if (action) {
          throw new Error("each transition definition must contain exactly one 'use' statement");
        }
        action = arg.payload;
      } else {
        var ctxt = (arg.side === 'from') ? from : to;
        var list = (arg.type === 'route') ? ctxt.routes : ctxt.contexts;
        list.push(arg.payload);
      }
    }

    if (!action) {
      throw new Error("a transition definition contains no 'use' statement");
    }

    if (from.routes.length === 0) {
      from.routes.push(DSL.ANY);
    }
    if (to.routes.length === 0) {
      to.routes.push(DSL.ANY);
    }
    if (from.contexts.length === 0) {
      from.contexts.push(DSL.ANY);
    }
    if (to.contexts.length === 0) {
      to.contexts.push(DSL.ANY);
    }
    
    this.map.register(from, to, action);
  },

  // fromRoute and toRoute necessarily only match transitions that
  // happen in a {{liquid-outlet}}, not transitions that happen in a
  // {{liquid-with}}, because the latter have no routes involved.
  fromRoute: function(name) {
    return {
      side: 'from',
      type: 'route',
      payload: name
    };
  },

  toRoute: function(name) {
    return {
      side: 'to',
      type: 'route',
      payload: name
    };
  },

  // fromContext and toContext can match both {{liquid-outlet}}
  // transitions and {{liquid-with}} transitions. 
  fromContext: function(matcher) {
    return {
      side: 'from',
      type: 'context',
      payload: matcher
    };
  },

  toContext: function(matcher) {
    return {
      side: 'to',
      type: 'context',
      payload: matcher
    };
  },


  use: function(nameOrHandler) {
    return {
      type: 'action',
      payload: nameOrHandler
    };
  }
};

DSL.ANY = '__liquid-fire-ANY';

export default DSL;
