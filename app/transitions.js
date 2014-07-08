import { Transitions } from "./libs/liquid-fire";

export default Transitions.map(function(){
  this.from('test-outlet.index').to('test-outlet.second').use('toRight');
  this.from('test-outlet.second').to('test-outlet.index').use('toLeft');
  this.from('empty').to('test-outlet.index').use('crossFade');
  this.from('default').to('default').use('toRight');
});
