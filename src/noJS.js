
import events from './events.js';
import reactive from './reactive.js';
import utils from './utils.js';
import bindings from './bindings.js';
import template from './template.js';

export class noJS {

  constructor(shadowDom, template) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    this.self.shadowRoot.appendChild(template.content.cloneNode(true));

    // interpolate variable
    toHTML(this.self);

    events.createEventListener(this.self);

  }


  makeReactive = (varObj) => {
    const allElements = this.self.shadowRoot.querySelectorAll('*');
    allElements.forEach(element => {
      //addDataBindAttr(element, variable);
      //reactive.updateVarHTMLOnLoad(element, varObj);
      template.updateVarHTMLOnLoad(self, element, varObj);
      template.updateVarAttrOnLoad(
        self, 
        element,
        utils.updateEventFunctionArgs,
        varObj,
      );
      //reactive.updateVarAttrOnLoad(element, varObj);
    })

    // add data-bind listener and variable to react when there is an event
    bindings.addDataBindListener(this.self);
    //events.createEventListener(this.self);

    // make variable reactive
    return reactive.createReactive(
      this.self, 
      varObj, 
      events.createEventListener,
      template.updateVarHTMLOnChange,
      template.updateVarAttrOnChange
    );

  }

}


export const toHTML = (self) => {
  const allElements = self.shadowRoot.querySelectorAll('*');
  allElements.forEach(element => {
    template.updateVarHTMLOnLoad(self, element, {});
    template.updateVarAttrOnLoad(
      self, 
      element,
      utils.updateEventFunctionArgs,
      {}
    );
  })
};



export default {
  noJS
}