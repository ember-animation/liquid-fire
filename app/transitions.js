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
}

function Transition(oldView, newContent, animation) {
  this.oldView = oldView;
  this.newContent = newContent;
  this.animation = animation;
}

Transition.prototype = {
  run: function(container) {
    if (!this.animation) {
      this.oldView.destroy();
      return container._pushNewView(this.newContent);
    }

    var self = this;
    function insertNewView() {
      debugger;
      if (self.inserted) {
	return self.inserted;
      }
      return self.inserted = container._pushNewView(self.newContent);
    }
    return this.animation(this.oldView, insertNewView).then(function(){
      self.maybeDestroyOldView();
    });
  },

  maybeDestroyOldView: function(){
    if (!this.interrupted) {
      this.oldView.destroy();
    }
  },

  interrupt: function(){
    debugger;
    // If we haven't yet inserted the new view, don't. And tell the
    // old view not to destroy when our animation stops, because the
    // next transition is going to take over and keep using it.
    if (!this.inserted) {
      this.inserted = Promise.cast(null);
      this.interrupted = true;
    }
  }
};

// Wraps our calls to velocity.js so they always return a promise
// (there's a PR in velocity upstream to add native promise support).
//
// In general, our API uses promises over the built-in queues provided
// by animation libraries because promises are more composable and
// general purpose across animation methods.
function animate(view, props, opts) {
  debugger;
  return new Promise(function(resolve) {
    if (!view) {
      resolve();
      return;
    }
    if (!opts) {
      opts = {};
    }
    opts.complete = resolve;
    debugger;
    view.$().velocity(props, opts);
  });
}

export default Transitions.map(function(){
  $.Velocity.defaults.duration = 250;
  
  this.defineTransition('toRight', function(oldView, insertNewView) {
    oldView.$().velocity('stop', true);
    return insertNewView().then(function(newView){    
      return Promise.all([
	animate(oldView, {translateX: "-100%"}),
	animate(newView, {translateX: ["0%", "100%"]})
      ]);
    });
  });

  this.defineTransition('toLeft', function(oldView, insertNewView) {
    oldView.$().velocity('stop', true);
    return insertNewView().then(function(newView){
      return Promise.all([
	animate(oldView, {translateX: "100%"}),
	animate(newView, {translateX: ["0%", "-100%"]})
      ]);
    });
  });

  this.defineTransition('crossFade', function(oldView, insertNewView) {
    oldView.$().velocity('stop', true);
    return animate(oldView, {opacity: 0})
      .then(insertNewView)
      .then(function(newView){
	return animate(newView, {opacity: [1, 0]});
      });
  });
  
  this.from('index').to('second').use('toRight');
  this.from('second').to('index').use('toLeft');
});
