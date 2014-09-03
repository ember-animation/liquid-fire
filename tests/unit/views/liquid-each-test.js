/*jshint newcap:false*/
import Ember from "ember";
import { test } from 'ember-qunit';
import { view, moduleMaker, check } from "../../helpers/fire-helpers";

var run = Ember.run,
    set = Ember.set,
    get = Ember.get;

var makeModuleFor = moduleMaker("helper:liquid-each", {
  needs: ['view:liquid-each']
});

makeModuleFor("the #liquid-each helper", {
  template: "{{#each view.people}}{{name}}{{/each}}",
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }])
});

function people() {
  return view().get('people');
}

test("it renders the template for each item in an array", function() {
  check("Steve HoltAnnabelle");
});

test("it updates the view if an item is added", function() {
  run(function() {
    people().pushObject({ name: "Tom Dale" });
  });
  check("Steve HoltAnnabelleTom Dale");
});

test("it updates the view if an item is removed", function() {
  run(function() {
    people().removeAt(0);
  });
  check("Annabelle");
});

test("it updates the view if an item is replaced", function() {
  run(function() {
    people().removeAt(0);
    people().insertAt(0, { name: "Kazuki" });
  });

  check("KazukiAnnabelle");
});

test("can add and replace in the same runloop", function() {
  run(function() {
    people().pushObject({ name: "Tom Dale" });
    people().removeAt(0);
    people().insertAt(0, { name: "Kazuki" });
  });

  check("KazukiAnnabelleTom Dale");
});

test("can add and replace the object before the add in the same runloop", function() {
  run(function() {
    people().pushObject({ name: "Tom Dale" });
    people().removeAt(1);
    people().insertAt(1, { name: "Kazuki" });
  });

  check("Steve HoltKazukiTom Dale");
});

test("can add and replace complicatedly", function() {
  run(function() {
    people().pushObject({ name: "Tom Dale" });
    people().removeAt(1);
    people().insertAt(1, { name: "Kazuki" });
    people().pushObject({ name: "Firestone" });
    people().pushObject({ name: "McMunch" });
    people().removeAt(3);
  });

  check("Steve HoltKazukiTom DaleMcMunch");
});

test("can add and replace complicatedly harder", function() {
  run(function() {
    people().pushObject({ name: "Tom Dale" });
    people().removeAt(1);
    people().insertAt(1, { name: "Kazuki" });
    people().pushObject({ name: "Firestone" });
    people().pushObject({ name: "McMunch" });
    people().removeAt(2);
  });

  check("Steve HoltKazukiFirestoneMcMunch");
});


makeModuleFor("#liquid-each using {{this}}", {
  template: "{{#each view.people}}{{this}}{{/each}}",
  people: Ember.A(['Black Francis', 'Joey Santiago', 'Kim Deal', 'David Lovering'])
});

test("it allows you to access the current context using {{this}}", function() {
  check("Black FrancisJoey SantiagoKim DealDavid Lovering");
});

makeModuleFor("#liquid-each ul", {
  template: '<ul>{{#each view.people}}<li>{{name}}</li>{{/each}}</ul>',
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }])
});

test("it works inside a ul element", function() {
  equal(view().$('li').length, 2, "renders two <li> elements");

  run(function() {
    people().pushObject({name: "Black Francis"});
  });

  equal(view().$('li').length, 3, "renders an additional <li> element when an object is added");

});

makeModuleFor("#liquid-each table", {
  template: '<table><tbody>{{#each view.people}}<tr><td>{{name}}</td></tr>{{/each}}</tbody></table>',
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }])
});

test("it works inside a table element", function() {
  equal(view().$('td').length, 2, "renders two <td> elements");

  run(function() {
    people().pushObject({name: "Black Francis"});
  });

  equal(view().$('td').length, 3, "renders an additional <td> element when an object is added");

  run(function() {
    people().insertAt(0, {name: "Kim Deal"});
  });

  equal(view().$('td').length, 4, "renders an additional <td> when an object is inserted at the beginning of the array");
});

makeModuleFor("#liquid-each itemController", {
  template: '{{#each view.people itemController="person"}}{{controllerName}}{{/each}}',
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
  setup: function(viewAttrs) {
    this.container.register('controller:person', Ember.Controller.extend({
      controllerName: Ember.computed(function() {
        return "controller:"+this.get('model.name');
      })
    }));
    this.container.register('controller:array', Ember.ArrayController.extend());
    viewAttrs.controller = {container: this.container };
  }
});

test('it supports itemController', function() {
  check("controller:Steve Holtcontroller:Annabelle");

  run(function() {
    view().rerender();
  });

  check("controller:Steve Holtcontroller:Annabelle");

  run(function() {
    people().pushObject({ name: "Yehuda Katz" });
  });

  check("controller:Steve Holtcontroller:Annabellecontroller:Yehuda Katz");

  run(function() {
    set(view(), 'people', Ember.A([{ name: "Trek Glowacki" }, { name: "Geoffrey Grosenbach" }]));
  });

  check("controller:Trek Glowackicontroller:Geoffrey Grosenbach");

  strictEqual(view().get('_childViews')[0].get('_arrayController.target'), get(view(), 'controller'), "the target property of the child controllers are set correctly");
});

makeModuleFor("#liquid-each itemController parentController", {
  template: '{{#each view.people itemController="person"}}{{controllerName}}{{/each}}',
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
  setup: function(viewAttrs) {
    this.container.register('controller:person', Ember.ObjectController.extend({
      controllerName: Ember.computed(function() {
        return "controller:" + get(this, 'model.name') + ' of ' + get(this, 'parentController.company');
      })
    }));
    this.container.register('controller:array', Ember.ArrayController.extend());
    viewAttrs.controller = {container: this.container, company: 'Yapp' };
  }
});

test("itemController specified in template gets a parentController property", function() {
  check("controller:Steve Holt of Yappcontroller:Annabelle of Yapp");
});


makeModuleFor("#liquid-each itemController ArrayController", {
  template: '{{#each}}{{controllerName}}{{/each}}',
  setup: function(viewAttrs) {
    this.container.register('controller:person', Ember.ObjectController.extend({
      controllerName: Ember.computed(function() {
        return "controller:" + get(this, 'model.name') + ' of ' + get(this, 'parentController.company');
      })
    }));
    this.container.register('controller:people', Ember.ArrayController.extend({
      model: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
      itemController: 'person',
      company: 'Yapp'
    }));
    viewAttrs.controller = this.container.lookup('controller:people');
  }
});

test("itemController specified in ArrayController gets a parentController property", function() {
  check("controller:Steve Holt of Yappcontroller:Annabelle of Yapp");
});

makeModuleFor("#liquid-each itemControler parentController", {
  template: '{{#each}}{{controllerName}}{{/each}}',
  setup: function(viewAttrs) {
    this.container.register('controller:person', Ember.ObjectController.extend({
      controllerName: Ember.computed(function() {
        return "controller:" + get(this, 'model.name') + ' of ' + get(this, 'parentController.company');
      })
    }));
    this.container.register('controller:people', Ember.ArrayController.extend({
      model: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
      itemController: 'person',
      parentController: Ember.computed(function(){
        return this.container.lookup('controller:company');
      }),
      company: 'Yapp'
    }));
    this.container.register('controller:company', Ember.Controller.extend());
    viewAttrs.controller = this.container.lookup('controller:people');
  }
});

test("itemController's parentController property, when the ArrayController has a parentController", function() {
  check("controller:Steve Holt of Yappcontroller:Annabelle of Yapp");
});

makeModuleFor("#liquid-each itemController custom keyword", {
  template: '{{#each person in view.people itemController="person"}}{{person.controllerName}}{{/each}}',
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
  setup: function(viewAttrs) {
    this.container.register('controller:person', Ember.ObjectController.extend({
      controllerName: Ember.computed(function() {
        return "controller:"+this.get('model.name');
      })
    }));
    this.container.register('controller:array', Ember.ArrayController.extend());
    viewAttrs.controller = { container: this.container };
  }
});

test("it supports itemController when using a custom keyword", function() {
  check("controller:Steve Holtcontroller:Annabelle");
  run(function() {
    view().rerender();
  });
  check("controller:Steve Holtcontroller:Annabelle");
});
