import { Promise } from '../index';

// This is what we run when no animation is asked for. It just sets
// the newly-added element to visible (because we always start them
// out invisible so that transitions can control their initial
// appearance).
export default function defaultTransition() {
  if (this.newElement) {
    this.newElement.style.visibility = '';
  }
  return Promise.resolve();
}
