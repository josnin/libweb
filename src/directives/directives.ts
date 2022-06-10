import { 
  ifDirective,
  bindDirective,
  eventDirective,
  forOfDirective,
  noBindDirective,
  varDirective,
  attrDirective
} from '../directives/index.js';

export class Directives {

  el: any;
  args: any[];
  register = [
    ifDirective,
    bindDirective,
    varDirective,
    eventDirective,
    forOfDirective,
    noBindDirective,
    attrDirective
  ];

  constructor(...args: any[]) {
    this.args = args;
  }

  async apply(): Promise<void> {
    const [self, prop, val] = this.args;
    for (const d of this.register) {
      for (const el1 of self.shadowRoot.querySelectorAll('*')) {
        for ( const el of el1.childNodes) {
          await d(self, el, prop, val);
        }
      }
    }
  }

}

export default {
  Directives
};
