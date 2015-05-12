import Ember from 'ember';
import { shouldDisplay } from 'liquid-fire/ember-internals';

export default Ember.Component.extend({
  positionalParams: ['predicate'],
  tagName: '',
  helperName: 'liquid-if',
  didReceiveAttrs() {
    var predicate = shouldDisplay(this.getAttr('predicate'));
    this.set('showFirstBlock', this.inverted ? !predicate : predicate);
  }
});
