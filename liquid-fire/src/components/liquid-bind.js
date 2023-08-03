import Component from '@glimmer/component';

export default class LiquidBindComponent extends Component {
  get forwardMatchContext() {
    let m = this.args.matchContext;
    if (!m) {
      m = {};
    }
    if (!m.helperName) {
      m.helperName = 'liquid-bind';
    }
    return m;
  }
}
