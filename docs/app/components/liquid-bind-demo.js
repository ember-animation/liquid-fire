import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { run } from '@ember/runloop';
import isBrowser from 'liquid-fire/is-browser';
import moment from 'moment';

export default class LiquidBindDemoComponent extends Component {
  @tracked now;
  @tracked hours;
  @tracked minutes;
  @tracked seconds;

  constructor() {
    super(...arguments);

    this.tick();

    const self = this;

    if (!isBrowser()) {
      return;
    }

    this.interval = setInterval(function () {
      run(self, 'tick');
    }, 1000);
  }

  tick(now) {
    if (!now) {
      now = moment();
    }

    this.now = now;
    this.hours = now.format('hh');
    this.minutes = now.format('mm');
    this.seconds = now.format('ss');
  }

  willDestroy() {
    super.willDestroy();
    clearInterval(this.interval);
  }

  @action
  forceTick() {
    clearInterval(this.interval);
    this.tick(this.now.add({ hours: 1, minutes: 1, seconds: 1 }));
  }
}
