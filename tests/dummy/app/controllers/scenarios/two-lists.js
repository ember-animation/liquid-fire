import Ember from 'ember';

export default Ember.Controller.extend({
  leftItems: Ember.computed({
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

  rightItems: Ember.computed({
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
    moveLeft(item) {
      let rightItems = this.get('rightItems');
      let leftItems = this.get('leftItems');
      let index = rightItems.indexOf(item);
      this.set('rightItems', rightItems.slice(0, index).concat(rightItems.slice(index+1)));
      this.set('leftItems', leftItems.concat([item]).sort(numeric));
    },
    moveRight(item) {
      let rightItems = this.get('rightItems');
      let leftItems = this.get('leftItems');
      let index = leftItems.indexOf(item);
      this.set('leftItems', leftItems.slice(0, index).concat(leftItems.slice(index+1)));
      this.set('rightItems', rightItems.concat([item]).sort(numeric));
    }
  }
});

function numeric(a,b) { return a.id - b.id; }

function makeRandomItem() {
  return { id: Math.round(Math.random()*1000) };
}
