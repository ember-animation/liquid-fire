import { Transitions } from "./libs/animate";

export default Transitions.map(function(){
  this.from('index').to('second').use('toRight');
  this.from('second').to('index').use('toLeft');
});
