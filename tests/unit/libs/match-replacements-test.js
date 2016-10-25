import { module, test } from 'qunit';
import matchReplacements from 'liquid-fire/match-replacements';

module("Unit | matchReplacements", {
  beforeEach(assert){
    assert.containsId = function( value, expected, message ) {
      this.pushResult({
        result: value.find(elt => elt.item.id === expected),
        actual: value,
        expected: expected,
        message: message
      });
    };
    assert.containsReplacement = function( value, expected, message ) {
      let [oldId, newId] = expected;
      this.pushResult({
        result: value.find(elt => elt[0].item.id === oldId && elt[1].item.id === newId),
        actual: value,
        expected: expected,
        message: message
      });
    };
    assert.count = function( value, expected, message) {
      this.pushResult({
        result: value.length === expected,
        actual: value,
        expected: 'length(' + expected + ')',
        message: message
      });
    };
  }
});

class Harness {
  constructor(size=10) {
    this.items = [];
    for (let id = 0; id < size; id++) {
      this.items.push({ id });
    }
  }
  alter(fn) {
    let newList = this.items.slice();
    fn(newList);
    let inserted = newList.filter(elt => this.items.indexOf(elt) < 0);
    let removed = this.items.filter(elt => newList.indexOf(elt) < 0);
    let kept = this.items.filter(elt => newList.indexOf(elt) >= 0);
    return matchReplacements(
      this.items,
      newList,
      inserted.map(e => ({ item: e })),
      kept.map(e => ({ item: e })),
      removed.map(e => ({ item: e }))
    );
  }
}

test("empty case", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(() => {});
  assert.count(inserted, 0, 'inserted');
  assert.count(removed, 0, 'removed');
  assert.count(replaced, 0, 'replaced');
});

test("append to head", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(list => {
    list.unshift({ id: 'new' });
  });
  assert.count(inserted, 1, 'inserted');
  assert.containsId(inserted, 'new');
  assert.count(removed, 0, 'removed');
  assert.count(replaced, 0, 'replaced');
});

test("remove at head", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(list => {
    list.shift();
  });
  assert.count(inserted, 0, 'inserted');
  assert.count(removed, 1, 'removed');
  assert.containsId(removed, 0);
  assert.count(replaced, 0, 'replaced');
});

test("replace at head", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(list => {
    list.shift();
    list.unshift({ id: 'new' });
  });
  assert.count(inserted, 0, 'inserted');
  assert.count(removed, 0, 'removed');
  assert.count(replaced, 1, 'replaced');
  assert.containsReplacement(replaced, [0, 'new']);
});

test("replace in middle", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(list => {
    list.splice(5, 1, { id: 'new' });
  });
  assert.count(inserted, 0, 'inserted');
  assert.count(removed, 0, 'removed');
  assert.count(replaced, 1, 'replaced');
  assert.containsReplacement(replaced, [5, 'new']);
});

test("replace multiple togther in middle", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(list => {
    list.splice(5, 2, { id: 'new' }, { id: 'new2' });
  });
  assert.count(inserted, 0, 'inserted');
  assert.count(removed, 0, 'removed');
  assert.count(replaced, 2, 'replaced');
  assert.containsReplacement(replaced, [5, 'new']);
  assert.containsReplacement(replaced, [6, 'new2']);
});

test("replace in middle with insertions above", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(list => {
    list.splice(5, 1, { id: 'new' });
    list.unshift({ id: 'above' });
  });
  assert.count(inserted, 1, 'inserted');
  assert.containsId(inserted, 'above');
  assert.count(removed, 0, 'removed');
  assert.count(replaced, 1, 'replaced');
  assert.containsReplacement(replaced, [5, 'new']);
});

test("replace multiple together in middle with insertions above", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(list => {
    list.splice(5, 2, { id: 'new' }, { id: 'new2' });
    list.unshift({ id: 'above' });
  });
  assert.count(inserted, 1, 'inserted');
  assert.containsId(inserted, 'above');
  assert.count(removed, 0, 'removed');
  assert.count(replaced, 2, 'replaced');
  assert.containsReplacement(replaced, [5, 'new']);
  assert.containsReplacement(replaced, [6, 'new2']);
});

test("replace in middle with deletions above", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(list => {
    list.splice(5, 1, { id: 'new' });
    list.shift();
  });
  assert.count(inserted, 0, 'inserted');
  assert.count(removed, 1, 'removed');
  assert.containsId(removed, 0);
  assert.count(replaced, 1, 'replaced');
  assert.containsReplacement(replaced, [5, 'new']);
});

test("replace multiple together in middle with deletions above", function(assert){
  let [inserted, removed, replaced] = new Harness().alter(list => {
    list.splice(5, 2, { id: 'new' }, { id: 'new2' });
    list.shift();
  });
  assert.count(inserted, 0, 'inserted');
  assert.count(removed, 1, 'removed');
  assert.containsId(removed, 0);
  assert.count(replaced, 2, 'replaced');
  assert.containsReplacement(replaced, [5, 'new']);
  assert.containsReplacement(replaced, [6, 'new2']);
});
