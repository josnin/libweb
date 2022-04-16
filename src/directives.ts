import { If } from './directives/if.directives.js';

export class Directives {

  el: any;
  self: any;
  registry = [If];

  constructor(self:any, el: any) {
    this.el = el;
    this.self = self;
  }

  apply() {
    this.registry.forEach(d => {
      this.el = d(this.self, this.el);
    })
    return this.el;
  }
}

export default {
  Directives
}