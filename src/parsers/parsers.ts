import { htmlParser } from './html.parser.js';
import { attrParser } from './attr.parser.js';
import { htmlReactive  } from './htmlR.parser.js';
import { attrReactive  } from './attrR.parser.js';

export class Parsers {

  args: any[];
  once = [htmlParser, attrParser];
  reactive = [htmlReactive, attrReactive]

  constructor(...args: any[]) {
    this.args = args;
  }

  applyOnce() {
    const [self, el] = this.args;
    this.once.forEach(d => {
      d(self, el);
    })
  }

  applyReactive() {
    const [self, el, prop, val] = this.args;
    this.reactive.forEach(d => {
      d(self, el, prop, val);
    })
  }
}

export default {
  Parsers
}