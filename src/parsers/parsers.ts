import { htmlParser } from './html.parser.js';
import { attrParser } from './attr.parser.js';
import { htmlVarReactive } from './html-var-r.parser.js';
import { attrEvtReactive } from './attr-evt-r.parser.js';
import { inputValReactive } from './inputr.parser.js';
import { htmlPipeParser } from './html-pipe.parser.js';

export class Parsers {

  args: any[];
  once = [htmlParser, attrParser, htmlPipeParser];
  reactive = [inputValReactive, htmlVarReactive, attrEvtReactive];

  constructor(...args: any[]) {
    this.args = args;
  }

  applyOnce(): void {
    const [self, el] = this.args;
    this.once.forEach(d => {
      d(self, el);
    });
  }

  applyReactive(): void {
    const [self, el, prop, val] = this.args;
    this.reactive.forEach(d => {
      d(self, el, prop, val);
    });
  }
}

export default {
  Parsers
};
