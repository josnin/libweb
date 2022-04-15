
import events from './events.js';
import reactive from './reactive.js';
import bindings from './bindings.js';
import templates from './template.js';

export class LibWeb {

  self: any;

  constructor(shadowDom: any, template: any) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    this.self.shadowRoot.innerHTML = template; // inject

    templates.updateTemplate(this.self);
    events.createEventListener(this.self);

    this.self.__reactive = this.makeReactive(this.self.__reactive);

  }


  makeReactive = (varObj: any) => {

    // add data-bind listener and variable to react when there is an event
    bindings.addDataBindListener(this.self);

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
