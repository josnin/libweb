import utils, { getArgLocation } from "./utils.js";

export const updateVarAttrOnLoad = (
    self, 
    element,
    updateEventFunctionArgs,
    reactiveObj
) => {
  for (let [_, attr] of Object.entries(element.attributes)) { 
    let updatedFnArgs = updateEventFunctionArgs(self, 
      attr.name, 
      attr.value,
      reactiveObj
    );

    if (updatedFnArgs) {
      // data-onclick-1232345245345 suffix timestamp to make sure its unique event
      element.setAttribute(
        `data-${attr.name.replace('@', 'on')}-${Date.now()}`,  
        updatedFnArgs
      );

      // remove @click attributes
      element.removeAttribute(`${attr.name}`);

    }
  }
};

export const updateVarHTMLOnLoad = (self, element, reactiveObj) => {
  // replace with real value {username} > johnny,
  element.innerHTML.split(' ').forEach(text => {
    if (utils.getVar(text)) {
      const var1 = utils.getVar(text)[0];
      const cleanVar = utils.strip(text, '{', '}');
      let result = null;
      if (self[cleanVar] != undefined) {
        result = self[cleanVar];
      } else if(reactiveObj[cleanVar] != undefined) { // applies for reactive variable
         result = reactiveObj[cleanVar];
      }
      if (result) {
        element.innerHTML = element.innerHTML.replaceAll(
          var1, 
          `${result}<!--${cleanVar}-->` 
        )
      }
    }
  })
}

export const updateVarHTMLOnChange = (
  element, 
  reactiveObj, 
  varName, 
  varValue
) => {
  element.innerHTML = element.innerHTML.replaceAll(
    `${reactiveObj[varName]}<!--${varName}-->`, 
    `${varValue}<!--${varName}-->`
  );
}

export const updateVarAttrOnChange = (
  element, 
  prop, 
  value
) => {
  for (let [_, attr] of Object.entries(element.attributes)) { 
    if (attr.name.startsWith('data-on') && 
        attr.value.includes(`{${prop}}`) // make sure to only update those with changes
    ) {

      const argLocation = utils.getArgLocation(attr.value, prop);
      const oldArgs = utils.getOldArgs(attr.value);
      const newArgs = utils.getNewArgs(
        oldArgs, 
        argLocation, 
        value
      )

      let finalAttribute = attr.value.replaceAll(
        `${oldArgs}`, 
        `${newArgs}`
      );
      element.setAttribute(
        `${attr.name}`, 
        finalAttribute
      );
    }
  }
};

export default {
  updateVarHTMLOnLoad,
  updateVarAttrOnLoad,
  updateVarHTMLOnChange,
  updateVarAttrOnChange
}