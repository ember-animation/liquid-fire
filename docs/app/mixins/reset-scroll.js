import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import Ember from 'ember';

export default Mixin.create({
  fastboot: service(),
  activate: function () {
    this._super();
    if (!Ember.testing && !this.get('fastboot.isFastBoot')) {
      window.scrollTo(0, 0);
    }
  },
});
