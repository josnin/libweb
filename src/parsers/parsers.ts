import  { htmlVarParser } from './html-var.parser.js';
import { attrEvtParser } from './attr-evt.parser.js';
import { htmlVarReactive } from './html-var-r.parser.js';
import { attrEvtReactive } from './attr-evt-r.parser.js';
import { inputValReactive } from './input-val-r.parser.js';

export class Parsers {

  args: any[];
  once = [htmlVarParser, attrEvtParser];
  reactive = [inputValReactive, htmlVarReactive, attrEvtReactive]

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