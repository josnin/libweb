
import { Directives } from './directives/directives.js';
import { Parsers } from './parsers/parsers.js';

class LibW extends HTMLElement { }
customElements.define('lib-w', LibW);

export class LibWeb {

  self: any;

  constructor(shadowDom: any, template: any) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    this.self.shadowRoot.innerHTML = `<lib-w>${template}</lib-w>`; // inject
    //this.self.shadowRoot.innerHTML = template;

    this.self.shadowRoot.querySelectorAll('*').forEach( (el: any) => {
        const parser = new Parsers(this.self, el);
        parser.apply();
    });

    this.self.shadowRoot.querySelectorAll('*').forEach( (el: any) => {
      const directive = new Directives(this.self, el);
      directive.apply();
    });

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
        allElements.forEach((el: any) => {

            // {username} > johny<!--{username}-->
            const parser = new Parsers(this.self, el, prop, value);
            parser.apply();

            const directive = new Directives(this.self, el, prop, value);
            el = directive.apply();

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
