
import { Directives } from './directives/directives.js';
import { Parsers } from './parsers/parsers.js';

class LibW extends HTMLElement { }
customElements.define('lib-w', LibW);


export class LibWeb {

  self: any;

  constructor(shadowDom: any, template: any) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    this.self.shadowRoot.innerHTML = `<lib-w>${template} <slot></slot></lib-w>`; // inject
    // this.self.shadowRoot.innerHTML = template;
    this.runParserAndDirectives();
    this.self.__reactive = this.makeReactive(this.self.__reactive);
  }

  async runParserAndDirectives(prop: string = '', val: string = '')  {

      const parsers = new Parsers(this.self, prop, val);
      await parsers.apply();

      const directives = new Directives(this.self, prop, val);
      await directives.apply();

  }


  makeReactive = (varObj: any) => {

    // react when there is a changes in value
    const handler = {
      get: (varObj: any, prop: string) => {
        return varObj[prop] ;
      },
      set: (varObj: any, prop: string, value: string) => {
        this.runParserAndDirectives(prop, value);
        varObj[prop] = value;
        return true;
      }
    };

    return new Proxy(varObj, handler);

  }

}


export class LWElement extends HTMLElement {

  __reactive: any = {}; // { username: 'darling' }
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
};
