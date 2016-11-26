import Ember from 'ember';
import { task } from 'ember-concurrency';
import { afterRender } from 'liquid-fire/concurrency-helpers';

export default Ember.Component.extend({
  currentSort: numeric,
  items: Ember.computed({
    get() {
      let result = [];
      for (let i = 0; i < 10; i++) {
        result.push(makeRandomItem());
      }
      return result.sort(numeric);
    },
    set(k,v) {
      return v;
    }
  }),
  addItem: task(function * () {
      this.get('notify.lock')();
      let items = this.get('items');
      this.set('items', items.concat([makeRandomItem()]).sort(this.currentSort).map(elt => ({ id: elt.id })));
      yield afterRender();
      yield this.get('notify.measure')();
      yield this.get('notify.unlock')();
  }),
  removeItem: task(function * (which) {
    this.get('notify.lock')();
    let items = this.get('items');
    this.set('items', items.filter(i => i !== which));
    yield afterRender();
    yield this.get('notify.measure')();
    yield this.get('notify.unlock')();
  })
});

function numeric(a,b) { return a.id - b.id; }

function makeRandomItem() {
  return { id: Math.round(Math.random()*1000) };
}
