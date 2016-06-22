import { moduleForComponent, test } from 'ember-qunit';
import Component from 'ember-component';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

let sample, tmap, animationStarted;

moduleForComponent('liquid-sync', 'Integration | Component | liquid sync', {
  integration: true,

  beforeEach() {
    tmap = this.container.lookup('service:liquid-fire-transitions');
    this.registry.register('component:x-sample', Component.extend({
      didInsertElement() {
        sample = this;
      }
    }));
    this.registry.register('template:components/x-sample', hbs`<div class="sample">Sample</div>`);
    animationStarted = false;
    this.registry.register('transition:spy', function() {
      animationStarted = true;
      return Ember.RSVP.Promise.resolve();
    });
  },

  afterEach(assert) {
    const done = assert.async();
    tmap.waitUntilIdle().then(done);
  }
});

test('it causes the transition to wait', function(assert) {
  this.render(hbs`
    {{#liquid-if activated use="spy"}}
      {{#liquid-sync as |sync|}}
        {{x-sample ready=sync}}
      {{/liquid-sync}}
    {{else}}
      <div class="off">Off</div>
    {{/liquid-if}}
  `);

  assert.equal(this.$('.off').length, 1, "Initially showing off");
  assert.equal(this.$('.sample').length, 0, "Initially not showing sample");

  this.set('activated', true);

  assert.equal(animationStarted, false, "No animation yet");
  assert.equal(this.$('.off').length, 1, "Found Off");
  assert.equal(this.$('.sample').length, 1, "Found sample");

  Ember.run(() => sample.sendAction('ready'));

  assert.equal(animationStarted, true, "Animation started");
  return tmap.waitUntilIdle().then(() => {
    assert.equal(this.$('.sample').length, 1, "Found sample");
    assert.equal(this.$('.off').length, 0, "Off is gone");
  });
});

test('transition moves on if component is destroyed', function(assert) {
  this.render(hbs`
    {{#liquid-if activated use="spy"}}
      {{#if innerThing}}
         <div class="alt">Alt</div>
      {{else}}
        {{#liquid-sync as |sync|}}
          {{x-sample ready=sync}}
        {{/liquid-sync}}
      {{/if}}
    {{else}}
      <div class="off">Off</div>
    {{/liquid-if}}
  `);

  assert.equal(this.$('.off').length, 1, "Initially showing off");
  assert.equal(this.$('.sample').length, 0, "Initially not showing sample");

  this.set('activated', true);

  assert.equal(animationStarted, false, "No animation yet");
  assert.equal(this.$('.off').length, 1, "Found Off");
  assert.equal(this.$('.sample').length, 1, "Found sample");

  this.set('innerThing', true);

  assert.equal(animationStarted, true, "Animation started");
  return tmap.waitUntilIdle().then(() => {
    assert.equal(this.$('.alt').length, 1, "Found alt");
    assert.equal(this.$('.off').length, 0, "Off is gone");
  });
});

test('it considers liquid-fire non-idle when waiting for liquid-sync to resolve', function(assert) {
  this.render(hbs`
    {{#liquid-if activated use="spy"}}
      {{#liquid-sync as |sync|}}
        {{x-sample ready=sync}}
      {{/liquid-sync}}
    {{else}}
      <div class="off">Off</div>
    {{/liquid-if}}
  `);


  this.set('activated', true);

  assert.equal(animationStarted, false, "No animation yet");
  assert.ok(tmap.runningTransitions() > 0, "Isn't idle");
});
