
import events from './events.js';
import reactive from './reactive.js';
import bindings from './bindings.js';
import templates from './template.js';

export class LibWeb {

  self: any;
  reactive: any; // { username: 'darling' }

  constructor(shadowDom: any, template: any) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    if (typeof(template) === 'object') {
      this.self.shadowRoot.appendChild(template.content.cloneNode(true));
    } else {
      this.self.shadowRoot.innerHTML = template;
    }
    // if self.template?

    templates.updateTemplate(this.self);
    events.createEventListener(this.self);

    this.self.reactive = this.makeReactive(this.self.reactive);

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



export default {
  LibWeb
}
