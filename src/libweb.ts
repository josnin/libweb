
import events from './events.js';
import reactive from './reactive.js';
import templates from './template.js';
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
      parser.apply();

      const directive = new Directives(this.self, el);
      el = directive.apply();

    });

    events.createEventListener(this.self);

    this.self.__reactive = this.makeReactive(this.self.__reactive);

  }


  makeReactive = (varObj: any) => {

    // make variable reactive
    return reactive.createReactive(
      this.self, 
      varObj, 
      events,
      templates,
    );

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
