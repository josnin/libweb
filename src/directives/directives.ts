import { ifDirective } from './if.directive.js';
import { bindDirective } from './bind.directive.js';

export class Directives {

  el: any;
  self: any;
  declare = [ifDirective, bindDirective];

  constructor(self:any, el: any) {
    this.el = el;
    this.self = self;
  }

  apply() {
    this.declare.forEach(d => {
      this.el = d(this.self, this.el);
    })
    return this.el;
  }
}

export default {
  Directives
}