import { If } from './directives/if.directive.js';

export class Directives {

  el: any;
  self: any;
  declare = [If];

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