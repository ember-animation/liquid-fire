import { Transitions } from "./libs/liquid-fire";

export default Transitions.map(function(){
  this.from('index').to('second').use('toRight');
  this.from('second').to('index').use('toLeft');
});
