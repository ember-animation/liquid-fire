/*jshint newcap:false*/
import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';
import { configure } from "liquid-fire/initializers/liquid-fire";

var run = Ember.run,
    set = Ember.set,
    get = Ember.get;

var view;

function localModuleFor(title, attrs) {
  moduleFor("helper:liquid-with", title, {
    needs: ['view:liquid-with', 'view:liquid-child', 'template:liquid-with', 'helper:with-apply'],
    setup: function(){
      var a;
      configure(this.container);
      if (typeof(attrs) === 'function') {
        a = attrs.apply(this);
      } else {
        a = Ember.copy(attrs, true);
      }
      if (a.template) {
        a.template = Ember.Handlebars.compile(a.template);
      }
      a.container = this.container;

      if (a.setup) {
        a.setup.apply(this);
        delete a.setup;
      }
      
      view = Ember.View.create(a);
      run(function() {
        view.appendTo('#qunit-fixture');
      });
    },
    teardown: function(){
      if (attrs.teardown) {
        attrs.teardown.apply(this);
      }
      run(function(){ view.destroy(); });
      view = null;
    }
  });
}

// tolerate whitespace differences, caused by the extra markup we add.
function check(expected, comment) {
  var text = view.$().text().replace(/\s/g, '');
  equal(text, expected.replace(/\s/g,''), comment);
}

localModuleFor("Handlebars {{#liquid-with}} helper", {
  template: "{{#with person as tom}}{{title}}: {{tom.name}}{{/with}}",
  context: {
    title: "Señor Engineer",
    person: { name: "Tom Dale" }
  }
});

test("it should support #liquid-with foo as bar", function() {
  check("Señor Engineer: Tom Dale", "should be properly scoped");
});

test("updating the context should update the alias", function() {
  run(function() {
    view.set('context.person', {
      name: "Yehuda Katz"
    });
  });

  check("Señor Engineer: Yehuda Katz", "should be properly scoped after updating");
});

test("updating a property on the context should update the HTML", function() {
  run(function() {
    set(view, 'context.person.name', "Yehuda Katz");
  });

  check("Señor Engineer: Yehuda Katz", "should be properly scoped after updating");
});

test("updating a property on the view should update the HTML", function() {
  run(function() {
    view.set('context.title', "Señorette Engineer");
  });

  check("Señorette Engineer: Tom Dale", "should be properly scoped after updating");
});


localModuleFor("Multiple Handlebars {{with}} helpers with 'as'", {
  template: "Admin: {{#liquid-with admin as person}}{{person.name}}{{/liquid-with}} User: {{#liquid-with user as person}}{{person.name}}{{/liquid-with}}",
  context: {
    admin: { name: "Tom Dale" },
    user: { name: "Yehuda Katz"}
  }
});

test("re-using the same variable with different #liquid-with blocks does not override each other", function(){
  check("Admin: Tom Dale User: Yehuda Katz", "should be properly scoped");
});

test("the scoped variable is not available outside the {{with}} block.", function(){
  run(function() {
    view.set('template', Ember.Handlebars.compile("{{name}}-{{#liquid-with other as name}}{{name}}{{/liquid-with}}-{{name}}"));
    view.set('context', {
      name: 'Stef',
      other: 'Yehuda'
    });
  });

  check("Stef-Yehuda-Stef", "should be properly scoped after updating");
});

test("nested {{with}} blocks shadow the outer scoped variable properly.", function(){
  run(function() {
    view.set('template', Ember.Handlebars.compile("{{#liquid-with first as ring}}{{ring}}-{{#liquid-with fifth as ring}}{{ring}}-{{#liquid-with ninth as ring}}{{ring}}-{{/liquid-with}}{{ring}}-{{/liquid-with}}{{ring}}{{/liquid-with}}"));
    view.set('context', {
      first: 'Limbo',
      fifth: 'Wrath',
      ninth: 'Treachery'
    });
  });

  check("Limbo-Wrath-Treachery-Wrath-Limbo", "should be properly scoped after updating");
});

(function(){
  var originalLookup;
  localModuleFor("Handlebars {{#liquid-with}} globals helper", {
    setup: function(){
      originalLookup = Ember.lookup;
      Ember.lookup = { Foo: { bar: 'baz' }};
    },
    template: "{{#liquid-with Foo.bar as qux}}{{qux}}{{/liquid-with}}",
    teardown: function() {
      Ember.lookup = originalLookup;
    }
  });

  test("it should support #liquid-with Foo.bar as qux", function() {
    check("baz", "should be properly scoped");

    run(function() {
      set(Ember.lookup.Foo, 'bar', 'updated');
    });

    check("updated", "should update");
  });
})();

localModuleFor("Handlebars {{#liquid-with keyword as foo}}", {
  template: "{{#liquid-with view as myView}}{{myView.name}}{{/liquid-with}}",
  name: "Sonics"
});

test("it should support #liquid-with view as foo", function() {
  check("Sonics", "should be properly scoped");

  run(function() {
    set(view, 'name', "Thunder");
  });

  check("Thunder", "should update");

});

localModuleFor("Handlebars {{#liquid-with keyword as foo}}", {
  template: "{{#liquid-with name as foo}}{{#liquid-with foo as bar}}{{bar}}{{/liquid-with}}{{/liquid-with}}",
  context: { name: "caterpillar" }
});


test("it should support #liquid-with name as food, then #liquid-with foo as bar", function() {
  check("caterpillar", "should be properly scoped");

  run(function() {
    set(view, 'context.name', "butterfly");
  });

  check("butterfly", "should update");
});

localModuleFor("Handlebars {{#liquid-with this as foo}}", function(){ return {
  template: "{{#liquid-with this as person}}{{person.name}}{{/liquid-with}}",
  controller: Ember.Object.create({ name: "Los Pivots" })
};});

test("it should support #liquid-with this as qux", function() {
  check("Los Pivots", "should be properly scoped");

  run(function() {
    set(view, 'controller.name', "l'Pivots");
  });

  check("l'Pivots", "should update");
});

localModuleFor("Handlebars {{#liquid-with foo}} insideGroup", {});

test("it should render without fail", function() {
  var View = Ember.View.extend({
    template: Ember.Handlebars.compile("{{#view view.childView}}{{#liquid-with person}}{{name}}{{/liquid-with}}{{/view}}"),
    controller: Ember.Object.create({ person: { name: "Ivan IV Vasilyevich" } }),
    childView: Ember.View.extend({
      render: function(){
        this.set('templateData.insideGroup', true);
        return this._super.apply(this, arguments);
      }
    })
  });

  view = View.create({ container: this.container });
  run(function(){ view.appendTo('#qunit-fixture'); });
  check("Ivan IV Vasilyevich", "should be properly scoped");

  run(function() {
    set(view, 'controller.person.name', "Ivan the Terrible");
  });

  check("Ivan the Terrible", "should update");
});

(function(){
  var parentController, person;
  
  localModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function() {
    var Controller = Ember.ObjectController.extend({
      controllerName: Ember.computed(function() {
        return "controller:"+this.get('model.name') + ' and ' + this.get('parentController.name');
      })
    });

    person = Ember.Object.create({name: 'Steve Holt'});

    parentController = Ember.Object.create({
      container: this.container,
      name: 'Bob Loblaw'
    });
    this.container.register('controller:person', Controller);
    
    return {
      template: '{{#liquid-with view.person controller="person"}}{{controllerName}}{{/liquid-with}}',
      person: person,
      controller: parentController
    };
  });

  test("it should wrap context with object controller", function() {

    check("controller:Steve Holt and Bob Loblaw");

    run(function() {
      view.rerender();
    });

    check("controller:Steve Holt and Bob Loblaw");

    run(function() {
      parentController.set('name', 'Carl Weathers');
      view.rerender();
    });

    check("controller:Steve Holt and Carl Weathers");

    run(function() {
      person.set('name', 'Gob');
      view.rerender();
    });

    check("controller:Gob and Carl Weathers");

    strictEqual(view.get('_childViews')[0].get('controller.target'), parentController, "the target property of the child controllers are set correctly");

  });
})();


(function(){
  var parentController, person, people;
  
  localModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function() {
    var Controller = Ember.ObjectController.extend({
      controllerName: Ember.computed(function() {
        return "controller:"+this.get('model.name') + ' and ' + this.get('parentController.name');
      })
    });

    people = Ember.A([{ name: "Steve Holt" }, { name: "Carl Weathers" }]);    

    parentController = Ember.Object.create({
      container: this.container,
      name: 'Bob Loblaw',
      people: people
    });
    this.container.register('controller:person', Controller);
    
    return {
      template: '{{#each person in people}}{{#liquid-with person controller="person"}}{{controllerName}}{{/liquid-with}}{{/each}}',
      controller: parentController
    };
  });

  test("it should still have access to original parentController within an {{#each}}", function() {

    check("controller:Steve Holt and Bob Loblawcontroller:Carl Weathers and Bob Loblaw");
  });
})();

(function(){
  var PersonController, person, parentController;
  localModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function(){

    PersonController = Ember.ObjectController.extend({
      name: Ember.computed('model.name', function() {
        return get(this, 'model.name').toUpperCase();
      })
    });
    this.container.register('controller:person', PersonController);
    
    person = Ember.Object.create({name: 'Steve Holt'});

    parentController = Ember.Object.create({
      container: this.container,
      person: person,
      name: 'Bob Loblaw'
    });


    
    return {
      template: '{{#liquid-with person as steve controller="person"}}{{name}} - {{steve.name}}{{/liquid-with}}',
      controller: parentController
    };
  });

  test("it should wrap keyword with object controller", function() {
    check("Bob Loblaw - STEVE HOLT");

    run(function() {
      view.rerender();
    });

    check("Bob Loblaw - STEVE HOLT");

    run(function() {
      parentController.set('name', 'Carl Weathers');
      view.rerender();
    });

    check("Carl Weathers - STEVE HOLT");

    run(function() {
      person.set('name', 'Gob');
      view.rerender();
    });

    check("Carl Weathers - GOB");
  });
})();

(function(){
  var destroyed, Controller, person, parentController;
  localModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function(){
    destroyed = false;
    Controller = Ember.ObjectController.extend({
      willDestroy: function() {
        this._super();
        destroyed = true;
      }
    });
    this.container.register('controller:person', Controller);
    
    person = Ember.Object.create({name: 'Steve Holt'});

    parentController = Ember.Object.create({
      container: this.container,
      person: person,
      name: 'Bob Loblaw'
    });

    return {
      template: '{{#liquid-with person controller="person"}}{{controllerName}}{{/liquid-with}}',
      controller: parentController
    };
  });
  
  test("destroys the controller generated with {{with foo controller='blah'}}", function() {
    run(view, 'destroy'); // destroy existing view
    ok(destroyed, 'controller was destroyed properly');
  });
})();

(function(){
  var destroyed, Controller, person, parentController;
  localModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function(){
    destroyed = false;
    Controller = Ember.ObjectController.extend({
      willDestroy: function() {
        this._super();
        destroyed = true;
      }
    });
    this.container.register('controller:person', Controller);
    
    person = Ember.Object.create({name: 'Steve Holt'});

    parentController = Ember.Object.create({
      container: this.container,
      person: person,
      name: 'Bob Loblaw'
    });

    return {
      template: '{{#liquid-with person as steve controller="person"}}{{controllerName}}{{/liquid-with}}',
      controller: parentController
    };
  });
  
  test("destroys the controller generated with {{with foo controller='blah'}}", function() {
    run(view, 'destroy'); // destroy existing view
    ok(destroyed, 'controller was destroyed properly');
  });
})();



localModuleFor("{{#liquid-with}} helper binding to view keyword", {
  template: "We have: {{#liquid-with view.thing as fromView}}{{fromView.name}} and {{fromContext.name}}{{/liquid-with}}",
  thing: { name: 'this is from the view' },
  context: {
    fromContext: { name: "this is from the context" },
  }
});

test("{{with}} helper can bind to keywords with 'as'", function(){
  check("We have: this is from the view and this is from the context", "should render");
});
