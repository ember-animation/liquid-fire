import Transition from "./transition";
import DSL from "./dsl";
import Ember from "ember";
import rules from "./internal-rules";

var Transitions = Ember.Object.extend({
  init: function() {
    var config, container;
    this.activeCount = 0;
    this._map = {};
    this.map(rules);
    container = this.get('container');
    if (container) {
      config = container.lookupFactory('transitions:main');
    }
    if (config) {
      this.map(config);
    }
    if (Ember.testing) {
      this._registerWaiter();
    }
  },

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
      var key = this.match(firstTime, parentView, oldView, newContent);
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

  match: function(firstTime, parentView, oldView, newContent) {
    var change = {
      leaving: this._viewProperties(oldView, 'currentView'),
      entering: this._viewProperties(newContent),
      parentView: parentView,
      initialRender: firstTime
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

    return this._match(change, this._map, 0);
  },

  _match: function(change, ctxt, depth) {
    var index = 0,
        candidate, nextContext, answer,
        predicateArgs = this._predicateArgs(change, depth),
        candidates = this._candidatesFor(change, ctxt, predicateArgs[0], depth);

    for (index = 0; index < candidates.length; index++) {
      candidate = candidates[index];
      if (!candidate) { continue; }
      if (typeof(candidate[0]) === 'function'){
        if (candidate[0].apply(null, predicateArgs)) {
          nextContext = candidate[1];
        } else {
          nextContext = null;
        }
      } else {
        nextContext = ctxt[candidate];
      }
      if (nextContext) {
        if (depth === 4) {
          return nextContext;
        } else {
          answer = this._match(change, nextContext, depth + 1);
          if (answer) {
            return answer;
          }
        }
      }
    }
  },

  _predicateArgs: function(change, level) {
    switch (level) {
    case 0:
      return [change.leaving.route, change.entering.route];
    case 1:
      return [change.entering.route, change.leaving.route];
    case 2:
      return [change.parentView];
    case 3:
      return [change.leaving.context, change.entering.context];
    case 4:
      return [change.entering.context, change.leaving.context];
    }
  },

  _candidatesFor: function(change, ctxt, first, depth) {
    var candidates = [first || DSL.EMPTY].concat(ctxt.__functions);
    if (depth === 0 && change.initialRender) {
      return candidates;
    } else {
      return candidates.concat(DSL.ANY);
    }
  },

  _registerWaiter: function() {
    var self = this;
    this._waiter = function() {
      return self.runningTransitions() === 0;
    };
    Ember.Test.registerWaiter(this._waiter);
  },

  willDestroy: function() {
    if (this._waiter) {
      Ember.Test.unregisterWaiter(this._waiter);
      this._waiter = null;
    }
  }
});


Transitions.reopenClass({
  map: function(handler) {
    var t = Transitions.create();
    t.map(handler);
    return t;
  }
});

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
