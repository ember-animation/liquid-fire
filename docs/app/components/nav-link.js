import Component from '@glimmer/component';

export default class NavLinkComponent extends Component {
  get back() {
    return this.args.topic && this.args.direction === 'back';
  }

  get forward() {
    return this.args.topic && this.args.direction === 'forward';
  }
}
