
import events from './events.js';
import reactive from './reactive.js';
import bindings from './bindings.js';
import templates from './template.js';

export class Libweb {

  constructor(shadowDom, template) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    this.self.shadowRoot.appendChild(template.content.cloneNode(true));

    templates.updateTemplate(this.self, {});
    events.createEventListener(this.self);

  }


  makeReactive = (varObj) => {
    templates.updateTemplate(this.self, varObj);
    events.createEventListener(this.self);

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
  Libweb
}
