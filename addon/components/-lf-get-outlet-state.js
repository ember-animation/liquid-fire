import Ember from 'ember';
import { getOutletStateTemplate } from 'liquid-fire/ember-internals';

export default Ember.Component.extend({
  tagName: '',
  layout: getOutletStateTemplate
});
