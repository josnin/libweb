import { ifDirective } from './if.directive.js';
import { bindDirective } from './bind.directive.js';
import { eventDirective } from './event.directive.js';

export class Directives {

  el: any;
  args: any[];
  register = [ifDirective, bindDirective, eventDirective];

  constructor(...args: any[]) {
    this.args = args;
  }

  apply() {
    const [self, el, prop, val] = this.args;
    this.register.forEach(d => {
      d(self, el, prop, val);
    })
  }

}

export default {
  Directives
}