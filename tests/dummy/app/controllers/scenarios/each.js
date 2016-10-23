import Ember from 'ember';

export default Ember.Controller.extend({
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
  actions: {
    addItem() {
      let items = this.get('items');
      this.set('items', items.concat([makeRandomItem()]).sort(numeric));
    },
    removeItem(which) {
      let items = this.get('items');
      this.set('items', items.filter(i => i !== which));
    }
  }
});

function numeric(a,b) { return a.id - b.id; }

function makeRandomItem() {
  return { id: Math.round(Math.random()*1000) };
}
