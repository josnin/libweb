
import { Directives } from './directives/directives.js';
import { Parsers } from './parsers/parsers.js';

declare global {
  var LWElement: any;
}

class LibW extends HTMLElement { }
customElements.define('lib-w', LibW);


export class LibWeb {

  self: any;
  fragment: any;

  constructor(shadowDom: any, template: any) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    this.createTplFragment(template);
    this.runParserAndDirectives();
    this.self.__reactive = this.makeReactive(this.self.__reactive);
  }

  prependStyle = () => {
    const style = document.createElement('style');
    style.textContent = this.self.__styles;
    this.fragment.prepend(style)
  }

  createTplFragment = (template: string) => {
    this.fragment = new DocumentFragment;
    const libw = document.createElement('lib-w');
    const tpl = document.createElement('template');
    tpl.innerHTML = template;
    this.fragment.appendChild(libw); 
    this.fragment.querySelector('lib-w')?.appendChild(tpl.content.cloneNode(true));
  }

  runParserAndDirectives = async () =>  {
    const parsers = new Parsers(this.self, this.fragment);
    await parsers.apply();

    // @todo not related to parser & directives?
    this.prependStyle();
    this.self.shadowRoot.appendChild(this.fragment);

    const directives = new Directives(this.self, '', '');
    await directives.apply();
  }

  makeReactive = (varObj: any) => {

    // react when there is a changes in value
    const handler = {
      get: (varObj: any, prop: string): any => {
        if (typeof varObj[prop] === 'object' && varObj[prop] !== null) {
          return new Proxy(varObj[prop], handler);
        } else {
          return varObj[prop] ;
        }
      },
      set: (varObj: any, prop: string, val: string) => {
        const directives = new Directives(this.self, prop, val);
        directives.apply();
        varObj[prop] = val;
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

globalThis.LWElement = LWElement;

