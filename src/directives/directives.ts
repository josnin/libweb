import { ifDirective } from './if.directive.js';
import { bindDirective } from './bind.directive.js';
import { eventDirective } from './event.directive.js';
import { forOfDirective } from './for-of.directive.js';
import { noBindDirective } from './no-bind.directive.js';
import { varDirective } from './var.directive.js';
import { strAttrDirective  } from './string-attr.directive.js';
import { boolAttrDirective } from './boolean-attr.directive.js';
import { fnAttrDirective } from './function-attr.directive.js';

export class Directives {

  el: any;
  args: any[];
  register = [
    varDirective,
    strAttrDirective,
    boolAttrDirective,
    fnAttrDirective,
    ifDirective,
    bindDirective,
    eventDirective,
    forOfDirective,
    noBindDirective
  ];

  constructor(...args: any[]) {
    this.args = args;
  }

  async apply(): Promise<void> {
    const [self, prop, val] = this.args;
    for (const d of this.register) {
      for ( const el of self.shadowRoot.querySelectorAll('*') ) {
        await d(self, el, prop, val);
      }
    }
  }

}

export default {
  Directives
};
