import Service from '@ember/service';

class LiquidFireChild {
  constructor(uniqueChildId, componentClass){
    this.uniqueChildId = uniqueChildId;
    this.componentClass = componentClass;
  }
}

export default class LiquidFireChildrenService extends Service {
  children = [];
  _waitingFor = [];
  
  register(uniqueChildId, componentClass) {
    const child = new LiquidFireChild(uniqueChildId, componentClass);
    this.children.push(child);
    return child;
  }

  unregister(child) {
    const index = this.children.indexOf(child);
    
    if (index === -1) {
      return;
    }
    
    this.children.splice(index, 1);
  }
  
  closest(element) {
    if (!element) {
      return null;
    }
    
    const closestElement = element.closest('[data-liquid-child]');
    
    if (!closestElement) {
      return null;
    }
    
    if (closestElement.getAttribute('data-liquid-child') === element.getAttribute('data-liquid-child')) {
      return null;
    }
    
    var child = this.children.find((x) => x.uniqueChildId === closestElement.getAttribute('data-liquid-child'));
    
    if (!child) {
      return null;
    }
    
    return child.componentClass;
  }
}
