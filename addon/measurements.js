import Move from 'liquid-fire/motions/move';
import { allSettled } from 'ember-concurrency';

export default class Measurements {
  constructor(list) {
    this.list = list;
  }
  lock() {
    this.list.forEach(m => m.lock());
  }
  unlock() {
    this.list.forEach(m => m.unlock());
  }
  append() {
    this.list.forEach(m => m.append());
  }
  reveal() {
    this.list.forEach(m => m.reveal());
  }
  move(newMeasurements) {
    let motions = [];
    this.list.forEach(m => {
      let newMeasurement = newMeasurements.list.find(entry => entry.elt === m.elt);
      if (newMeasurement) {
        motions.push(m.move(newMeasurement));
      }
    });
    return motions;
  }
  enter() {
    return this.list.map(m => m.enter());
  }
  exit() {
    return this.list.map(m => m.exit());
  }
  replace(otherMeasurements) {
    return zip(otherMeasurements.list, this.list).map(([older, newer]) => {
      if (older.x === newer.x && older.y === newer.y) {
        return allSettled([older.exit(), newer.enter()]);
      } else {
        older.remove();
        return Move.create({
          element: newer.elt,
          initial: { x: older.x, y: older.y },
          final: { x: newer.x, y: newer.y },
          opts: { duration: 500 }
        }).run();
      }
    });
  }
}

function zip(listA, listB) {
  let output = [];
  for (let i = 0; i < Math.max(listA.length, listB.length); i++) {
    output.push([listA[i], listB[i]]);
  }
  return output;
}
