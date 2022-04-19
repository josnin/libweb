import { htmlReactive } from './html.reactive.js';
import { attrReactive } from './attr.reactive.js';

export class Reactives {

  el: any;
  self: any;
  prop: any;
  value: any;
  declare = [
    htmlReactive, 
    attrReactive,
  ];

  constructor(self:any, el: any, prop: any, val: any) {
    this.el = el;
    this.self = self;
    this.prop = prop;
    this.value = val;
  }

  apply() {
    this.declare.forEach(d => {
      d(this.self, this.el, this.prop, this.value);
    })
  }
}


export const createReactive = (
  self: any,
  varObj: any,
  events: any,
) => {
  // react when there is a changes in value
  // const allElements = self.shadowRoot.querySelectorAll('[data-bind]');
  const allElements = self.shadowRoot.querySelectorAll('*');
  const handler = {
    get: (varObj: any, prop: string) => {
      return varObj[prop] ;
    },
    set: (varObj: any, prop: string, value: string) => {
      allElements.forEach((element: any) => {
        if (element.type === 'text' &&
        element.dataset.bind === prop) {
          // make sure to update only that match with data-binding
          element.value = value;
        } else {
          // {username} > johny<!--{username}-->
          const reactive = new Reactives(
            self,
            element,
            prop,
            value
          )

          reactive.apply()

          events.createEventListener(self);
        }
      });
      varObj[prop] = value;
      return true;
    }
  };

  return new Proxy(varObj, handler);
};


export default {
  createReactive,
  Reactives
};
