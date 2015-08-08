import Ember from "ember";
export default Ember.Component.extend({
  classNames: ['liquid-child'],

  didInsertElement() {
    let $container = this.$();
    if ($container) {
      $container.css('visibility','hidden');
    }
    this.sendAction('liquidChildDidRender', this);
  }

});
