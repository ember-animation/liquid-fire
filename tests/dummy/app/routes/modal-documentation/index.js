import Ember from "ember";
import ResetScroll from "dummy/mixins/reset-scroll";
export default Ember.Route.extend(ResetScroll, {
  actions: {
    changeSalutation: function() {
      var controller = this.controllerFor("modal-documentation");
      var current = controller.get("salutation");
      var salutation = current === "Guten tag" ? "Hello" : "Guten tag";
      controller.set("salutation", salutation);
    }
  }
});
