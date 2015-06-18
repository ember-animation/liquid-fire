import Ember from 'ember';
import { test, moduleForComponent } from "ember-qunit";

moduleForComponent('Integration: private lf-component keyword', {
  integration: true,
  setup() {
    this.registry.register('template:components/x-sample', Ember.HTMLBars.compile(`
      <div class="name">{{name}}</div>
      <div class="number">{{number}}</div>
    `));
  }
});

test('it should render normal attributes', function(assert) {
  this.set('name', 'Keytar Bear');
  this.set('number', 1);
  this.render("{{lf-component 'x-sample' name=name number=number}}");
  assert.equal(this.$('.name').text().trim(), 'Keytar Bear');
  assert.equal(this.$('.number').text().trim(), '1');
});

test('it should render dynamic attributes', function(assert) {
  this.set('dyn', {
    name: 'Keytar Bear',
    number: 1
  });
  this.render("{{lf-component 'x-sample' attrs=dyn}}");
  assert.equal(this.$('.name').text().trim(), 'Keytar Bear');
  assert.equal(this.$('.number').text().trim(), '1');
});

test('it should update normal attributes', function(assert) {
  this.set('name', 'Keytar Bear');
  this.set('number', 1);
  this.render("{{lf-component 'x-sample' name=name number=number}}");
  this.set('name', 'Guitar Weasel');
  this.set('number', 2);
  assert.equal(this.$('.name').text().trim(), 'Guitar Weasel');
  assert.equal(this.$('.number').text().trim(), '2');
});

test('it should update dynamic attributes', function(assert) {
  let dyn = Ember.Object.create({
    name: 'Keytar Bear',
    number: 1
  });
  this.set('dyn', dyn);
  this.render("{{lf-component 'x-sample' attrs=dyn}}");

  Ember.run(() => {
    dyn.set('name', 'Guitar Weasel');
    dyn.set('number', 2);
  });
  assert.equal(this.$('.name').text().trim(), 'Guitar Weasel');
  assert.equal(this.$('.number').text().trim(), '2');
});

test('it should update entire set of dynamic attributes', function(assert) {
  this.set('dyn', {
    name: 'Keytar Bear',
    number: 1
  });
  this.render("{{lf-component 'x-sample' attrs=dyn}}");
  this.set('dyn', {
    name: 'Guitar Weasel',
    number: 2
  });
  assert.equal(this.$('.name').text().trim(), 'Guitar Weasel');
  assert.equal(this.$('.number').text().trim(), '2');
});
