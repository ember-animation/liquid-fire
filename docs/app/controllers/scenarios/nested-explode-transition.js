import Controller from '@ember/controller';
import { getOwner } from '@ember/application';
import { debounce } from '@ember/runloop';

export default Controller.extend({
  showOne: true,
  showA: true,
  
  init() {
    this._super(...arguments);
    
    // let resolveAnimation;
    // getOwner(this).register('transition:blocking', function () {
    //   console.log('asdf');
    //   return new EmberPromise(function (resolve) {
    //     console.log('asdf');
    //     resolveAnimation = resolve;
    //   });
    // });
    
    // debounce(this, () => resolveAnimation(), 2000);
  },

  actions: {
    toggle(prop) {
      this.toggleProperty(prop);
    },
  },
});
