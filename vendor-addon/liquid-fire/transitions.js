import Transition from "./transition";
import DSL from "./dsl";

function Transitions() {
  this._map = {};
  this.map(function(){
    this.setDefault({duration: 250});
  });
}

Transitions.prototype = {

  activeCount: 0,

  runningTransitions: function() {
    return this.activeCount;
  },

  lookup: function(transitionName) {
    var handler = this.container.lookupFactory('transition:' + transitionName);
    if (!handler) {
      throw new Error("unknown transition name: " + transitionName);
    }
    return handler;
  },

  transitionFor: function(parentView, oldView, newContent, use, firstTime) {
    var handler, args;
    // "use" matches any transition *except* the initial render
    if (use && !firstTime) {
      handler = this.lookup(use);
    } else {
      var key = this.match(parentView, oldView, newContent);
      if (key) {
        args = key.args;
        if (typeof(key.method) === 'function') {
          handler = key.method;
        } else {
          handler = this.lookup(key.method);
        }
      }
    }

    // If we are not animating, but one of our ancestors is animating
    // us away, we should wait for the ancestor to finish before
    // letting our content be destroyed.
    if (!handler && oldView && !newContent) {
      var ancestorTransition = slatedForDestruction(oldView);
      if (ancestorTransition) {
        handler = waitForTransition;
        args = [ancestorTransition];
      }
    }

    return new Transition(parentView, oldView, newContent, handler, args, this);
  },

  map: function(handler) {
    if (handler){
      handler.apply(new DSL(this));
    }
    return this;
  },

  register: function(routes, contexts, parent, action) {
    this._register(this._map, [routes.from, routes.to, parent, contexts.from, contexts.to], action);
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
      return {};
    }

    return {
      route: view.get('renderedName'),
      context: view.get('liquidContext')
    };
  },

  _ancestorsRenderedName: function(view) {
    while (view && !view.get('renderedName')){
      view = view.get('_parentView');
    }
    if (view) {
      return view.get('renderedName');
    }
  },

  match: function(parentView, oldView, newContent) {
    var change = {
      leaving: this._viewProperties(oldView, 'currentView'),
      entering: this._viewProperties(newContent),
      parentView: parentView
    };

    // If the old/new views themselves are not part of a route
    // transition, provide route properties from our surrounding
    // context.
    if (oldView && !change.leaving.route) {
      change.leaving.route = this._ancestorsRenderedName(parentView);
    }
    if (newContent && !change.entering.route) {
      change.entering.route = change.leaving.route || this._ancestorsRenderedName(parentView);
    }

    return this._match(change, this._map, [
      change.leaving.route,
      change.entering.route,
      parentView,
      change.leaving.context,
      change.entering.context
    ]);
  },

  _match: function(change, ctxt, queue) {
    var index = 0,
        first = queue[0],
        rest = queue.slice(1),
        candidate, nextContext, answer,
        candidates = [first || DSL.EMPTY].concat(ctxt.__functions).concat(DSL.ANY);

    for (index = 0; index < candidates.length; index++) {
      candidate = candidates[index];
      if (!candidate) { continue; }
      if (typeof(candidate[0]) === 'function'){
        if (candidate[0].apply(first, this._predicateArgs(change, queue.length))) {
          nextContext = candidate[1];
        } else {
          nextContext = null;
        }
      } else {
        nextContext = ctxt[candidate];
      }
      if (nextContext) {
        if (rest.length === 0) {
          return nextContext;
        } else {
          answer = this._match(change, nextContext, rest);
          if (answer) {
            return answer;
          }
        }
      }
    }
  },

  _predicateArgs: function(change, remainingLevels) {
    var level = 5 - remainingLevels;
    switch (level) {
    case 0:
      return [change.entering.route];
    case 1:
      return [change.leaving.route];
    case 2:
      return [];
    case 3:
      return [change.entering.context];
    case 4:
      return [change.leaving.context];
    }
  },


};


Transitions.map = function(handler) {
  var t = new Transitions();
  t.map(handler);
  return t;
};

function slatedForDestruction(view) {
  var child;
  while (view._parentView) {
    child = view;
    view = view._parentView;
    if (view._runningTransition && view._runningTransition.oldView === child) {
      return view._runningTransition;
    }
  }
}

function waitForTransition() {
  return arguments[2].run();
}

export default Transitions;
