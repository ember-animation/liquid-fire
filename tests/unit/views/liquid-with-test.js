/*jshint newcap:false*/
import Ember from "ember";
import { test } from 'ember-qunit';
import { view, moduleMaker, check, compileTemplate } from "../../helpers/fire-helpers";

var run = Ember.run,
    set = Ember.set,
    get = Ember.get;

var makeModuleFor = moduleMaker("helper:liquid-with", {
  needs: ['view:liquid-with', 'view:liquid-child',
          'template:liquid-with', 'helper:with-apply']
});

makeModuleFor("Handlebars {{#liquid-with}} helper", {
  template: "{{#liquid-with person as tom}}{{title}}: {{tom.name}}{{/liquid-with}}",
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
    view().set('context.person', {
      name: "Yehuda Katz"
    });
  });

  check("Señor Engineer: Yehuda Katz", "should be properly scoped after updating");
});

test("updating a property on the context should update the HTML", function() {
  run(function() {
    set(view(), 'context.person.name', "Yehuda Katz");
  });

  check("Señor Engineer: Yehuda Katz", "should be properly scoped after updating");
});

test("updating a property on the view should update the HTML", function() {
  run(function() {
    view().set('context.title', "Señorette Engineer");
  });

  check("Señorette Engineer: Tom Dale", "should be properly scoped after updating");
});


makeModuleFor("Multiple Handlebars {{with}} helpers with 'as'", {
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
    view().set('template', compileTemplate("{{name}}-{{#liquid-with other as name}}{{name}}{{/liquid-with}}-{{name}}"));
    view().set('context', {
      name: 'Stef',
      other: 'Yehuda'
    });
  });

  check("Stef-Yehuda-Stef", "should be properly scoped after updating");
});

test("nested {{with}} blocks shadow the outer scoped variable properly.", function(){
  run(function() {
    view().set('template', compileTemplate("{{#liquid-with first as ring}}{{ring}}-{{#liquid-with fifth as ring}}{{ring}}-{{#liquid-with ninth as ring}}{{ring}}-{{/liquid-with}}{{ring}}-{{/liquid-with}}{{ring}}{{/liquid-with}}"));
    view().set('context', {
      first: 'Limbo',
      fifth: 'Wrath',
      ninth: 'Treachery'
    });
  });

  check("Limbo-Wrath-Treachery-Wrath-Limbo", "should be properly scoped after updating");
});


makeModuleFor("Handlebars {{#liquid-with keyword as foo}}", {
  template: "{{#liquid-with view as myView}}{{myView.name}}{{/liquid-with}}",
  name: "Sonics"
});

test("it should support #liquid-with view as foo", function() {
  check("Sonics", "should be properly scoped");

  run(function() {
    set(view(), 'name', "Thunder");
  });

  check("Thunder", "should update");

});

makeModuleFor("Handlebars {{#liquid-with keyword as foo}}", {
  template: "{{#liquid-with name as foo}}{{#liquid-with foo as bar}}{{bar}}{{/liquid-with}}{{/liquid-with}}",
  context: { name: "caterpillar" }
});


test("it should support #liquid-with name as food, then #liquid-with foo as bar", function() {
  check("caterpillar", "should be properly scoped");

  run(function() {
    set(view(), 'context.name', "butterfly");
  });

  check("butterfly", "should update");
});

makeModuleFor("Handlebars {{#liquid-with this as foo}}", function(){ return {
  template: "{{#liquid-with this as person}}{{person.name}}{{/liquid-with}}",
  controller: Ember.Object.create({ name: "Los Pivots" })
};});

test("it should support #liquid-with this as qux", function() {
  check("Los Pivots", "should be properly scoped");

  run(function() {
    set(view(), 'controller.name', "l'Pivots");
  });

  check("l'Pivots", "should update");
});

(function(){
  var parentController, person;

  makeModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function() {
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
      template: '{{#liquid-with view.person as p controller="person"}}{{p.controllerName}}{{/liquid-with}}',
      person: person,
      controller: parentController
    };
  });

  test("it should wrap context with object controller", function() {

    check("controller:Steve Holt and Bob Loblaw");

    run(function() {
      view().rerender();
    });

    check("controller:Steve Holt and Bob Loblaw");

    run(function() {
      parentController.set('name', 'Carl Weathers');
      view().rerender();
    });

    check("controller:Steve Holt and Carl Weathers");

    run(function() {
      person.set('name', 'Gob');
      view().rerender();
    });

    check("controller:Gob and Carl Weathers");

  });
})();


(function(){
  var parentController, person, people;

  makeModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function() {
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
      template: '{{#each person in people}}{{#liquid-with person as p controller="person"}}{{p.controllerName}}{{/liquid-with}}{{/each}}',
      controller: parentController
    };
  });

  test("it should still have access to original parentController within an {{#each}}", function() {

    check("controller:Steve Holt and Bob Loblawcontroller:Carl Weathers and Bob Loblaw");
  });
})();

(function(){
  var PersonController, person, parentController;
  makeModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function(){

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
      view().rerender();
    });

    check("Bob Loblaw - STEVE HOLT");

    run(function() {
      parentController.set('name', 'Carl Weathers');
      view().rerender();
    });

    check("Carl Weathers - STEVE HOLT");

    run(function() {
      person.set('name', 'Gob');
      view().rerender();
    });

    check("Carl Weathers - GOB");
  });
})();

(function(){
  var destroyed, Controller, person, parentController;
  makeModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function(){
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
      template: '{{#liquid-with person as p controller="person"}}{{p.controllerName}}{{/liquid-with}}',
      controller: parentController
    };
  });

  test("destroys the controller generated with {{with foo controller='blah'}}", function() {
    run(view(), 'destroy'); // destroy existing view
    ok(destroyed, 'controller was destroyed properly');
  });
})();

(function(){
  var destroyed, Controller, person, parentController;
  makeModuleFor("Handlebars {{#liquid-with foo}} with defined controller", function(){
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
    run(view(), 'destroy'); // destroy existing view
    ok(destroyed, 'controller was destroyed properly');
  });
})();



makeModuleFor("{{#liquid-with}} helper binding to view keyword", {
  template: "We have: {{#liquid-with view.thing as fromView}}{{fromView.name}} and {{fromContext.name}}{{/liquid-with}}",
  thing: { name: 'this is from the view' },
  context: {
    fromContext: { name: "this is from the context" },
  }
});

test("{{with}} helper can bind to keywords with 'as'", function(){
  check("We have: this is from the view and this is from the context", "should render");
});

makeModuleFor("{{#liquid-with}} class binding", {
  template: "{{#liquid-with thing class=\"magical\"}}{{name}}{{/liquid-with}}",
  thing: { name: 'this is from the view' }
});

test("{{liquid-with}} helper can bind classes", function(){
  equal(view().$('.liquid-container.magical').length, 1, "matches class selector");
});

makeModuleFor("{{#liquid-with}} containerless", {
  template: "{{#liquid-with person as p containerless=true}}{{p.name}}{{/liquid-with}}",
  context: {
    person: { name: "Tom Dale" }
  }
});

test("is containerless", function(){
  equal(Ember.$('#qunit-fixture .liquid-child').length, 1, "has liquid-child");
  equal(Ember.$('#qunit-fixture .liquid-container').length, 0, "doesn't have liquid-container");
});

makeModuleFor("outlets inside {{#liquid-with}}", {
  template: "{{#liquid-with view.thing as fromView}}{{outlet}}{{/liquid-with}}",
  thing: { name: 'me' },
});

test("should render", function(){
  run(function(){
    view().connectOutlet('main', Ember.View.create({
      template: compileTemplate("hello world")
    }));
  });
  check("hello world");
});
