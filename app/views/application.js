export default Ember.View.extend({
  didInsertElement: function(){
    console.log("using custom application view");
  },

  connectOutlet: function(outletName, view){
    console.log("connecting outlet " + outletName);
    this._super(outletName, view);
  },

  disconnectOutlet: function(outletName){
    console.log("disconnecting outlet " + outletName);
    this._super(outletName);
  }


});
