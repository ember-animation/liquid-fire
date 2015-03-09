import Ember from 'ember';
import { TestModule, getContext, setContext } from 'ember-test-helpers';
import { getResolver } from 'ember-test-helpers/test-resolver';

var TestModuleForIntegration = TestModule.extend({
  init: function(name, description, callbacks) {
    this._super.call(this, name, description, callbacks);
    this.setupSteps.push(this.setupIntegrationHelpers);
    this.teardownSteps.push(this.teardownView);
  },

  setupIntegrationHelpers: function() {
    var self = this;
    var context = this.context;
    context.dispatcher = Ember.EventDispatcher.create();
    context.dispatcher.setup({}, '#ember-testing');
    this.actionHooks = {};

    context.render = function(template) {
      if (Ember.isArray(template)) {
        template = template.join('');
      }
      if (typeof template === 'string') {
        template = Ember.Handlebars.compile(template);
      }
      self.view = Ember.View.create({
        context: context,
        controller: self,
        template: template,
        container: self.container
      });
      Ember.run(function() {
        self.view.appendTo('#ember-testing');
      });
    };

    context.$ = function() {
      return self.view.$.apply(self.view, arguments);
    };

    context.set = function(key, value) {
      Ember.run(function() {
        Ember.set(context, key, value);
      });
    };

    context.get = function(key) {
      return Ember.get(context, key);
    };

    context.on = function(actionName, handler) {
      self.actionHooks[actionName] = handler;
    };

  },

  setupContainer: function() {
    var resolver = getResolver();
    var namespace = Ember.Object.create({
      Resolver: { create: function() { return resolver; } }
    });

    if (Ember.Application.buildRegistry) {
      var registry;
      registry = Ember.Application.buildRegistry(namespace);
      registry.register('component-lookup:main', Ember.ComponentLookup);
      this.registry = registry;
      this.container = registry.container();
    } else {
      this.container = Ember.Application.buildContainer(namespace);
      this.container.register('component-lookup:main', Ember.ComponentLookup);
    }
  },

  setupContext: function() {
    setContext({
      container:  this.container,
      factory: function() {},
      dispatcher: null
    });

    this.context = getContext();
  },

  send: function(actionName) {
    var hook = this.actionHooks[actionName];
    if (!hook) {
      throw new Error("integration testing template received unexpected action " + actionName);
    }
    hook.apply(this, Array.prototype.slice.call(arguments, 1));
  },

  teardownView: function() {
    var view = this.view;
    if (view) {
      Ember.run(function() {
        view.destroy();
      });
    }
  }

});

function qunitModuleFor(module) {
  QUnit.module(module.name, {
    setup: function() {
      module.setup();
    },
    teardown: function() {
      module.teardown();
    }
  });
}

export default function moduleForIntegration(name, description, callbacks) {
  var module = new TestModuleForIntegration(name, description, callbacks);
  qunitModuleFor(module);
}
