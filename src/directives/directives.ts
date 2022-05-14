import { ifDirective } from './if.directive.js';
import { bindDirective } from './bind.directive.js';
import { eventDirective } from './event.directive.js';
import { forOfDirective } from './forOf.directive.js';
import { noBindDirective } from './noBind.directive.js';

export class Directives {

  el: any;
  args: any[];
  register = [
    ifDirective,
    bindDirective,
    eventDirective,
    forOfDirective,
    noBindDirective
  ];

  constructor(...args: any[]) {
    this.args = args;
  }

  apply(): void {
    const [self, prop, val] = this.args;
    for (const d of this.register) {
      for ( const el of self.shadowRoot.querySelectorAll('*') ) {
        d(self, el, prop, val);
      }
    }
  }

}

export default {
  Directives
};
