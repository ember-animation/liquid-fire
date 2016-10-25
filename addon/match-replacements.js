export default function matchReplacements(prevItems, items, inserted, kept, removed) {
  if (inserted.length === 0 || removed.length === 0) {
    return [inserted, removed, []];
  }

  let outputInserted = [];
  let outputRemoved = removed.slice();
  let outputReplaced = [];

  let keptIndices = {};
  kept.forEach(entry => {
    keptIndices[items.indexOf(entry.component)] = prevItems.indexOf(entry.component);
  });

  let removedIndices = {};
  removed.forEach(entry => {
    removedIndices[prevItems.indexOf(entry.component)] = entry;
  });

  inserted.forEach(entry => {
    let newIndex = items.indexOf(entry.component);
    let cursor = newIndex - 1;
    while (cursor > -1 && keptIndices[cursor] == null) {
      cursor--;
    }
    let stableIndex = keptIndices[cursor];
    let oldIndex;
    if (stableIndex != null) {
      oldIndex = stableIndex + 1;
    } else {
      oldIndex = 0;
    }
    let matchedRemoval = removedIndices[oldIndex];
    if (matchedRemoval) {
      outputReplaced.push([matchedRemoval, entry]);
      outputRemoved.splice(outputRemoved.indexOf(matchedRemoval), 1);
      keptIndices[newIndex] = oldIndex;
    } else {
      outputInserted.push(entry);
    }
  });

  return [outputInserted, outputRemoved, outputReplaced];

}
