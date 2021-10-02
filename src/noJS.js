
import events from './events.js';
import reactive from './reactive.js';
import utils from './utils.js';
import bindings from './bindings.js';

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
      reactive.updateReactiveVarHTMLOnLoad(element, varObj);
      reactive.updateReactiveVarAttrOnLoad(element, varObj);
    })

    // add data-bind listener and variable to react when there is an event
    bindings.addDataBindListener(this.self);
    //events.createEventListener(this.self);

    // make variable reactive
    return reactive.createReactive(
      this.self, 
      varObj, 
      events.createEventListener
    );

  }

}


export const toHTML = (self) => {
  const allElements = self.shadowRoot.querySelectorAll('*');
  allElements.forEach(element => {
    updateVarHTMLOnLoad(self, element);
    updateVarAttrOnLoad(self, element);
  })
};


const updateVarAttrOnLoad = (self, element) => {
  for (let [suffixID, attr] of Object.entries(element.attributes)) { 
    let updatedFnArgs = utils.updateEventFunctionArgs(self, 
      attr.name, 
      attr.value
    );

    if (updatedFnArgs) {
      // data-onclick-id1 suffix counter to make use its unique event
      element.setAttribute(
        `data-${attr.name.replace('@', 'on')}-id${suffixID}`,  
        updatedFnArgs
      );

      // remove @click attributes
      element.removeAttribute(`${attr.name}`);

    }
  }
};

const updateVarHTMLOnLoad = (self, element) => {
  // replace with real value {username} > johnny, applies on non-reactive variable
  element.textContent.split(' ').forEach(text => {
    if (text.startsWith('{') && text.endsWith('}')) {
      let variable = text.split('{')[1].split('}')[0];
      if (self[variable] != undefined) {
        element.innerHTML = element.innerHTML.replaceAll(
          text, 
          self[variable]
        )
      }
    }
  })
}


export default {
  noJS
}