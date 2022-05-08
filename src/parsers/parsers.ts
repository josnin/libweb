import { htmlParser } from './html.parser.js';
import { attrParser } from './attr.parser.js';
import { htmlVarReactive } from './htmlr.parser.js';
import { inputValReactive } from './inputr.parser.js';
import { htmlPipeParser } from './html-pipe.parser.js';


export class Parsers {

  args: any[];
  register = [
    htmlParser, 
    htmlPipeParser, 
    attrParser, 
    inputValReactive, 
    htmlVarReactive
  ];

  constructor(...args: any[]) {
    this.args = args;
  }

  apply(): void {
    const [self, prop, val] = this.args;
    this.register.forEach(d => {
      self.shadowRoot.querySelectorAll('*').forEach((el: any) => {
        d(self, el, prop, val);
      });
    });
  }
}

export default {
  Parsers,
};
