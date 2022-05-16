import { 
  ifDirective,
  bindDirective,
  eventDirective,
  forOfDirective,
  noBindDirective,
  varDirective,
  strAttrDirective,
  boolAttrDirective,
  fnAttrDirective
} from '../directives/index.js';

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
