import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { all } from 'rsvp';
import './liquid-child.css';

export default class LiquidChildComponent extends Component {
  @service liquidFireChildren;
  
  element = null;
  _waitingFor = [];
  _isLiquidChild = true;
  _serviceElement = null;

  @action
  setup(element) {
    this.element = element;
    
    this._serviceElement = this.liquidFireChildren.register(this.args.uniqueChildId, this);
    
    element.style.visibility = 'hidden';

    this._waitForAll().then(() => {
      if (!this.isDestroying) {
        this.liquidFireChildren._waitingFor = [];
        const didRenderAction = this.args.liquidChildDidRender;
        if (typeof didRenderAction === 'function') {
          didRenderAction(this);
        }
      }
    });
  }
  
  @action
  destroyElement() {
    if (this._serviceElement) {
      this.liquidFireChildren.unregister(this._serviceElement);
      this._serviceElement = null;
    }
  }

  _waitForMe(promise) {
    if (!this.liquidFireChildren._waitingFor) {
      return;
    }
    this.liquidFireChildren._waitingFor.push(promise);
    let ancestor = this.liquidFireChildren.closest(this.element);
    if (ancestor) {
      ancestor._waitForMe(promise);
    }
  }

  _waitForAll() {
    const promises = this.liquidFireChildren._waitingFor;
    this.liquidFireChildren._waitingFor = [];
    return all(promises).then(() => {
      if (this.liquidFireChildren._waitingFor.length > 0) {
        return this._waitForAll();
      }
    });
  }
}
