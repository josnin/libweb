
import events from './events.js';
import { Directives } from './directives/directives.js';
import { Parsers } from './parsers/parsers.js';

export class LibWeb {

  self: any;

  constructor(shadowDom: any, template: any) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    this.self.shadowRoot.innerHTML = template; // inject

    const allElements = this.self.shadowRoot.querySelectorAll('*');
    allElements.forEach( (el: any) => {
      const parser = new Parsers(this.self, el);
      parser.applyOnce();

      const directive = new Directives(this.self, el);
      el = directive.applyOnce();

    });

    events.createEventListener(this.self);

    this.self.__reactive = this.makeReactive(this.self.__reactive);

  }


  makeReactive = (varObj: any) => {

    // react when there is a changes in value
    // const allElements = self.shadowRoot.querySelectorAll('[data-bind]');
    const allElements = this.self.shadowRoot.querySelectorAll('*');
    const handler = {
      get: (varObj: any, prop: string) => {
        return varObj[prop] ;
      },
      set: (varObj: any, prop: string, value: string) => {
        allElements.forEach((element: any) => {
            // {username} > johny<!--{username}-->
            const parser = new Parsers(this.self, element, prop, value);
            parser.applyReactive();

            const directive = new Directives(this.self, element, prop, value);
            element = directive.applyReactive();

            events.createEventListener(this.self);
        });
        varObj[prop] = value;
        return true;
      }
    };

    return new Proxy(varObj, handler);

  }

}


export class LWElement extends HTMLElement {

  __reactive: any; // { username: 'darling' }
  __template: any;
  __styles: any;

  constructor() {
    super();
  }

  connectedCallback() {
    const lw = new LibWeb(this, this.__template);
  }

}


export default {
  LibWeb,
  LWElement
}
