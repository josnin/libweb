import { htmlParser } from './parsers/html.parser.js';
import { attrParser } from './parsers/attr.parser.js';

export class Parsers {

  el: any;
  self: any;
  declare = [htmlParser, attrParser];

  constructor(self:any, el: any) {
    this.el = el;
    this.self = self;
  }

  apply() {
    this.declare.forEach(d => {
      d(this.self, this.el);
    })
  }
}

export default {
  Parsers
}