/*jshint newcap:false*/
/* global sinon */

import Ember from "ember";
import { test } from 'ember-qunit';
import { view, moduleMaker, check } from "../../helpers/fire-helpers";

var run = Ember.run,
    set = Ember.set,
    get = Ember.get;

var makeModuleFor = moduleMaker("helper:liquid-each", {
  needs: ['view:liquid-each']
});

makeModuleFor("#liquid-each helper", {
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


makeModuleFor("#liquid-each helper", {
  template: "{{#each view.people}}{{this}}{{/each}}",
  people: Ember.A(['Black Francis', 'Joey Santiago', 'Kim Deal', 'David Lovering'])
});

test("it allows you to access the current context using {{this}}", function() {
  check("Black FrancisJoey SantiagoKim DealDavid Lovering");
});

makeModuleFor("#liquid-each helper", {
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

makeModuleFor("#liquid-each helper", {
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

makeModuleFor("#liquid-each helper", {
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

makeModuleFor("#liquid-each helper", {
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


makeModuleFor("#liquid-each helper", {
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

makeModuleFor("#liquid-each helper", {
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

makeModuleFor("#liquid-each helper", {
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

makeModuleFor("#liquid-each helper", {
  template: '{{each view.people itemView="anItemView"}}',
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
  setup: function(viewAttrs) {
    this.container.register('view:anItemView', Ember.View.extend({
      template: Ember.Handlebars.compile('itemView:{{name}}')
    }));
    viewAttrs.controller = { container: this.container };
  }
});

test("it supports {{itemView=}}", function() {
  check("itemView:Steve HoltitemView:Annabelle");
});

makeModuleFor("#liquid-each helper", {
  template: '{{each view.people itemView="an-item-view"}}',
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
  setup: function(viewAttrs) {
    this.container.register('view:an-item-view', Ember.View.extend({
      template: Ember.Handlebars.compile('itemView:{{name}}')
    }));
    sinon.spy(this.container, 'resolve');
    viewAttrs.controller = { container: this.container };
  }
});

test("it defers all normalization of itemView names to the resolver", function() {
  ok(this.container.resolve.calledWith("view:an-item-view"), "leaves fullname untouched");
});

makeModuleFor("#liquid-each helper", {
  template: '{{each view.people itemViewClass="my-view"}}',
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
  setup: function(viewAttrs) {
    this.container.register('view:my-view', Ember.View.extend({
      template: Ember.Handlebars.compile('{{name}}')
    }));
    sinon.spy(this.container, 'lookupFactory');
  }
});

test("it supports {{itemViewClass=}} via container", function() {
  ok(this.container.lookupFactory.calledWith('view:my-view'), 'looked up my-view');
  check("Steve HoltAnnabelle");
});

makeModuleFor("#liquid-each helper", {
  template: '{{each person in view.people itemViewClass="my-view"}}',
  people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
  setup: function(viewAttrs) {
    this.container.register('view:my-view', Ember.View.extend({
      template: Ember.Handlebars.compile('{{person.name}}')
    }));
    sinon.spy(this.container, 'lookupFactory');
  }
});

test("it supports {{itemViewClass=}} with in format", function() {
  ok(this.container.lookupFactory.calledWith('view:my-view'), 'looked up my-view');
  check("Steve HoltAnnabelle");
});

makeModuleFor("#liquid-each helper", {
  template: "{{#each view.items}}{{this}}{{else}}Nothing{{/each}}",
  items: Ember.A(['one', 'two'])
});

test("it supports {{else}}", function() {
  check('onetwo');
  run(function() {
    view().set('items', Ember.A());
  });
  check('Nothing');
});

makeModuleFor("#liquid-each helper", function(){ return {
  template: "{{#view}}{{#each controller}}{{this}}{{/each}}{{/view}}",
  controller: Ember.ArrayController.create({
    model: Ember.A(["foo", "bar", "baz"])
  }),
  setup: function() {
    this.container.register('view:toplevel', Ember.View.extend());
  }
};});

test("it works with the controller keyword", function() {
  check('foobarbaz');
});

makeModuleFor("#liquid-each helper", {
  template: "{{#each item in view.items}}{{view.title}} {{item}}{{/each}}",
  title: "My Cool Each Test",
  items: Ember.A([1, 2])
});

test("#each accepts a name binding", function() {
  check("My Cool Each Test 1My Cool Each Test 2");
});

makeModuleFor("#liquid-each helper", function(){ return {
  template: "{{#each item in view.items}}{{name}}{{/each}}",
  title: "My Cool Each Test",
  items: Ember.A([Ember.Object.create({
    name: 'henry the item'
  })]),
  controller: Ember.Controller.create({
    name: 'bob the controller'
  })
};});

test("#each accepts a name binding and does not change the context", function() {
  check("bob the controller");
});

makeModuleFor("#liquid-each helper", {
  template: "{{#each item in view.items}}{{view.title}} {{item.name}}{{/each}}",
  title: "My Cool Each Test",
  items: Ember.A([{ name: 1 }, { name: 2 }])
});

test("#each accepts a name binding and can display child properties", function() {
  check("My Cool Each Test 1My Cool Each Test 2");
});

makeModuleFor("#liquid-each helper", {
  template: "{{#each item in this}}{{view.title}} {{item.name}}{{/each}}",
  title: "My Cool Each Test",
  controller: Ember.A([{ name: 1 }, { name: 2 }])
});

test("#each accepts 'this' as the right hand side", function() {
  check("My Cool Each Test 1My Cool Each Test 2");
});

makeModuleFor("#liquid-each helper", {
  template: '{{#each controller}}{{#view}}{{name}}{{/view}}{{/each}}',
  controller: Ember.A([{ name: 'Adam' }, { name: 'Steve' }]),
  setup: function() {
    this.container.register('view:toplevel', Ember.View.extend());
  }
});

test("views inside #each preserve the new context", function() {
  check("AdamSteve");
});

makeModuleFor("#liquid-each helper", {
  template: '{{#each personController in this}}{{#view controllerBinding="personController"}}{{name}}{{/view}}{{/each}}',
  controller: Ember.A([{ name: 'Adam' }, { name: 'Steve' }]),
  setup: function() {
    this.container.register('view:toplevel', Ember.View.extend());
  }
});

test("controller is assignable inside an #each", function() {
  check("AdamSteve");
});

makeModuleFor("#liquid-each helper", {
  template: '{{#each}}{{name}}{{/each}}',
  context: Ember.A([{ name: 'Adam' }, { name: 'Steve' }])
});

test("single-arg each defaults to current context", function() {
  check("AdamSteve");
});

makeModuleFor("#liquid-each helper", {
  template: '{{#each}}{{name}}{{/each}}',
  controller: Ember.A([{ name: 'Adam' }, { name: 'Steve' }])
});

test("single-arg each will iterate over controller if present", function() {
  check("AdamSteve");
});

makeModuleFor("#liquid-each helper", {
  controller: Ember.A(['Cyril', 'David']),
  template: '<table><tbody>{{#each}}<tr><td>{{this}}</td></tr>{{/each}}<tbody></table>'
});

test("it doesn't assert when the morph tags have the same parent", function() {
  ok(true, "No assertion from valid template");
});

makeModuleFor("#liquid-each helper", {
  template: '{{#each person in people itemController="person"}}{{controllerName}} - {{person.controllerName}} - {{/each}}',
  setup: function(viewAttrs) {
    this.container.register('controller:array', Ember.ArrayController.extend());
    this.container.register('controller:person', Ember.Controller.extend({
      controllerName: Ember.computed(function() {
        return "controller:"+this.get('model.name');
      })
    }));
    viewAttrs.controller =  {
      container: this.container,
      people: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
      controllerName: 'controller:parentController'
    };
  }
});

test("itemController specified in template with name binding does not change context", function() {
  check("controller:parentController - controller:Steve Holt - controller:parentController - controller:Annabelle - ");

  run(function() {
    view().get('controller.people').pushObject({ name: "Yehuda Katz" });
  });

  check("controller:parentController - controller:Steve Holt - controller:parentController - controller:Annabelle - controller:parentController - controller:Yehuda Katz - ");

  run(function() {
    set(view().get('controller'), 'people', Ember.A([{ name: "Trek Glowacki" }, { name: "Geoffrey Grosenbach" }]));
  });

  check("controller:parentController - controller:Trek Glowacki - controller:parentController - controller:Geoffrey Grosenbach - ");

  strictEqual(view().get('_childViews')[0].get('_arrayController.target'), view().get('controller'), "the target property of the child controllers are set correctly");


});


makeModuleFor("#liquid-each helper", {
  template: '{{#each person in this}}{{controllerName}} - {{person.controllerName}} - {{/each}}',
  setup: function(viewAttrs) {
    this.container.register('controller:people', Ember.ArrayController.extend({
      model: Ember.A([{ name: "Steve Holt" }, { name: "Annabelle" }]),
      itemController: 'person',
      company: 'Yapp',
      controllerName: 'controller:people'
    }));
    this.container.register('controller:person', Ember.ObjectController.extend({
      controllerName: Ember.computed(function() {
        return "controller:" + get(this, 'model.name') + ' of ' + get(this, 'parentController.company');
      })
    }));
    viewAttrs.controller = this.container.lookup('controller:people');
  }
});

test("itemController specified in ArrayController with name binding does not change context", function() {
  check("controller:people - controller:Steve Holt of Yapp - controller:people - controller:Annabelle of Yapp - ");
});
