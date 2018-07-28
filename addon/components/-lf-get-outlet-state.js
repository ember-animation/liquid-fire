import Component from '@ember/component';
import { getOutletStateTemplate } from 'liquid-fire/ember-internals';

export default Component.extend({
  tagName: '',
  layout: getOutletStateTemplate
});
