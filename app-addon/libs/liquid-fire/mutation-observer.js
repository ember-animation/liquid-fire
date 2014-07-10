function MutationPoller(callback){
  this.callback = callback;
}

MutationPoller.prototype = {
  observe: function(){
    this.interval = setInterval(this.callback, 100);
  },
  disconnect: function() {
    clearInterval(this.interval);
  }
};

var M = (window.MutationObserver || window.WebkitMutationObserver || MutationPoller);

export default M;
