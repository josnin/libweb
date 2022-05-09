import { ifDirective } from './if.directive.js';
import { bindDirective } from './bind.directive.js';
import { eventDirective } from './event.directive.js';
import { forDirective } from './for.directive.js';

export class Directives {

  el: any;
  args: any[];
  register = [
    ifDirective,
    bindDirective,
    eventDirective,
    forDirective
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
