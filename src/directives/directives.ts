import { ifDirective } from './if.directive.js';
import { bindDirective } from './bind.directive.js';
import { eventDirective } from './event.directive.js';

export class Directives {

  el: any;
  args: any[];
  once = [ifDirective, bindDirective, eventDirective];
  reactive = [ifDirective];

  constructor(...args: any[]) {
    this.args = args;
  }

  applyOnce() {
    const [self, el, prop, val] = this.args;
    this.once.forEach(d => {
      this.el = d(self, el, prop, val);
    })
    return this.el;
  }

  applyReactive() {
    const [self, el, prop, val] = this.args;
    this.reactive.forEach(d => {
      this.el = d(self, el, prop, val);
    })
    return this.el;
  }
}

export default {
  Directives
}