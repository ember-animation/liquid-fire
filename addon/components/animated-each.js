import Ember from 'ember';
import layout from '../templates/components/animated-each';
import { task, allSettled } from 'ember-concurrency';
import { afterRender } from '../concurrency-helpers';
import Move from '../motions/move';

export default Ember.Component.extend({
  layout,
  tagName: '',
  motionService: Ember.inject.service('-ea-motion'),

  init() {
    this._super();
    this._enteringComponents = [];
    this._currentComponents = [];
    this._leavingComponents = [];
    this._prevItems = [];
    this._firstTime = true;
  },
  willDestroyElement() {
    let removed = flatMap(this._currentComponents, component => component.sprites());
    this.get('motionService.farMatch').perform([], removed, []);
  },
  didReceiveAttrs() {
    let prevItems = this._prevItems;
    let items = this.get('items') || [];
    this._prevItems = items.slice();

    if (this._currentComponents.length > 0) {
      this._notifyContainer('lock');
    }

    let currentSprites = flatMap(this._currentComponents, component => component.sprites());
    currentSprites.forEach(sprite => sprite.measureInitialBounds());
    currentSprites.forEach(sprite => sprite.lock());
    this.get('animate').perform(prevItems, items, currentSprites);
  },
  animate: task(function * (prevItems, items, currentSprites) {
    yield afterRender();

    let [keptSprites, removedSprites] = partition(
      currentSprites,
      sprite => this._leavingComponents.indexOf(sprite.component) < 0
    );

    // Briefly unlock everybody
    keptSprites.forEach(sprite => sprite.unlock());
    // so we can measure the final static layout
    let insertedSprites = flatMap(this._enteringComponents, component => component.sprites());
    insertedSprites.forEach(sprite => sprite.measureFinalBounds());
    keptSprites.forEach(sprite => sprite.measureFinalBounds());
    this._notifyContainer('measure');
    let tasks = [];

    // Update our permanent state here before we actualy animate. This
    // leaves us consistent in case we re-enter before the animation
    // finishes (we allow this task to be re-entrant, because some
    // Motions may choose not to interrupt already running Motions).
    this._updateComponentLists();

    // Then lock everything down
    keptSprites.forEach(sprite => sprite.lock());
    insertedSprites.forEach(sprite => sprite.lock());
    // Including ghost copies of the deleted components
    removedSprites.forEach(sprite => {
      sprite.append();
      sprite.lock();
    });

    // [inserted, removed, replaced] = matchReplacements(prevItems, items, inserted, kept, removed);
    // [inserted, removed, replaced] = yield this.get('motionService.farMatch').perform(inserted, removed, replaced);

    console.log(`inserted=${insertedSprites.length}, kept=${keptSprites.length}, removed=${removedSprites.length}`);

    if (this._firstTime) {
      this._firstTime = false;
      insertedSprites.forEach(sprite => {
        sprite.reveal();
      });
    } else {
      insertedSprites.forEach(sprite => {
        sprite.initialBounds = {
          left: sprite.finalBounds.left + 1000,
          top: sprite.finalBounds.top
        };
        sprite.translate(sprite.initialBounds.left - sprite.finalBounds.left, sprite.initialBounds.top - sprite.finalBounds.top);
        let move = Move.create(sprite, { duration: 500 });
        tasks.push(move.run());
      });
    }

    keptSprites.forEach(sprite => {
      let move = Move.create(sprite);
      tasks.push(move.run());
    });
    removedSprites.forEach(sprite => {
      sprite.finalBounds = {
        left: sprite.initialBounds.left + 1000,
        top: sprite.initialBounds.top
      };
      let move = Move.create(sprite);
      tasks.push(move.run().then(() => {
        sprite.remove();
      }));
    });

    let results = yield allSettled(tasks);

    results.forEach(result => {
      if (result.state === 'rejected' && result.reason.name !== 'TaskCancelation') {
        setTimeout(function() {
          throw result.reason;
        }, 0);
      }
    });

    // Last one out close the door on your way out.
    if (this.get('animate.concurrency') === 1) {
      keptSprites.forEach(sprite => sprite.unlock());
      insertedSprites.forEach(sprite => sprite.unlock());
      this._notifyContainer('unlock');
    }
  }),

  _updateComponentLists() {
    this._currentComponents = this._currentComponents.concat(this._enteringComponents)
      .filter(c => this._leavingComponents.indexOf(c) === -1);
    this._enteringComponents = [];
    this._leavingComponents = [];
  },

  _notifyContainer(method) {
    var target = this.get('notify');
    if (target && target[method]) {
      return target[method]();
    }
  },

  actions: {
    childEntering(component) {
      this._enteringComponents.push(component);
    },
    childLeaving(component) {
      this._leavingComponents.push(component);
    }
  }

}).reopenClass({
  positionalParams: ['items']
});


function partition(list, pred) {
  let matched = [];
  let unmatched = [];
  list.forEach(entry => {
    if (pred(entry)) {
      matched.push(entry);
    } else {
      unmatched.push(entry);
    }
  });
  return [matched, unmatched];
}

function flatMap(list, fn) {
  let results = [];
  for (let i = 0; i < list.length; i++) {
    results.push(fn(list[i]));
  }
  return [].concat(...results);
}
