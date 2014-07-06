import { Transitions, animate } from "./libs/animate";

export default Transitions.map(function(){
  this.setDefault({duration: 250});

  this.defineTransition('toRight', function(oldView, insertNewView) {
    oldView.$().velocity('stop', true);
    return insertNewView().then(function(newView){    
      return Promise.all([
	animate(oldView, {translateX: "-100%"}),
	animate(newView, {translateX: ["0%", "100%"]})
      ]);
    });
  });

  this.defineTransition('toLeft', function(oldView, insertNewView) {
    oldView.$().velocity('stop', true);
    return insertNewView().then(function(newView){
      return Promise.all([
	animate(oldView, {translateX: "100%"}),
	animate(newView, {translateX: ["0%", "-100%"]})
      ]);
    });
  });

  this.defineTransition('crossFade', function(oldView, insertNewView) {
    oldView.$().velocity('stop', true);
    return animate(oldView, {opacity: 0})
      .then(insertNewView)
      .then(function(newView){
	return animate(newView, {opacity: [1, 0]});
      });
  });
  
  this.from('index').to('second').use('toRight');
  this.from('second').to('index').use('toLeft');
});
