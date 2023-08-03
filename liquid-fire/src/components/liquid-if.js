import Component from '@glimmer/component';

export default class LiquidIfComponent extends Component {
	get helperName() {
		return this.args.helperName || 'liquid-if';
	}
}
