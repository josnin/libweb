
import events from './events.js';
import reactive from './reactive.js';
import bindings from './bindings.js';
import template1 from './template.js';

export class noJS {

  constructor(shadowDom, template) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    this.self.shadowRoot.appendChild(template.content.cloneNode(true));

    template1.updateTemplate(this.self, {});
    events.createEventListener(this.self);

  }


  makeReactive = (varObj) => {
    template1.updateTemplate(this.self, varObj);
    events.createEventListener(this.self);

    // add data-bind listener and variable to react when there is an event
    bindings.addDataBindListener(this.self);

    // make variable reactive
    return reactive.createReactive(
      this.self, 
      varObj, 
      events.createEventListener,
      template1.updateVarHTMLOnChange,
      template1.updateVarAttrOnChange
    );

  }

}



export default {
  noJS
}