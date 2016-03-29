import isBrowser from './is-browser';
var activePollers = [];

function MutationPoller(callback){
  this.callback = callback;
}

MutationPoller.prototype = {
  observe: function(){
    this.interval = setInterval(this.callback, 100);
    activePollers.push(this);
  },
  disconnect: function() {
    clearInterval(this.interval);
    activePollers.splice(activePollers.indexOf(this), 1);
  }
};

var M;
if (isBrowser()) {
  M = (window.MutationObserver || window.WebkitMutationObserver || MutationPoller);
} else {
  M = MutationPoller;
}


export default M;

// PhantomJS does not have real mutation observers, so to get
// reasonable test timing we have to manually kick it.
export function testingKick() {
  for (var i = 0; i < activePollers.length; i ++) {
    activePollers[i].callback();
  }
}
