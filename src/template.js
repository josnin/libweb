import utils from "./utils.js";

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
      const htmlVar = utils.getVar(text)[0];
      const cleanHtmlVar = utils.strip(text, '{', '}');
      let result = null;
      if (self[cleanHtmlVar] != undefined) {
        result = self[cleanHtmlVar];
      } else if(reactiveObj[cleanHtmlVar] != undefined) { // applies for reactive variable
         result = reactiveObj[cleanHtmlVar];
      }
      if (result) {
        element.innerHTML = element.innerHTML.replaceAll(
          htmlVar, 
          `${result}<!--${cleanHtmlVar}-->` 
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
  obj, 
  prop, 
  value
) => {
  for (let [_, attr] of Object.entries(element.attributes)) { 
    if (attr.name.startsWith('data-on') && 
        attr.value.includes(`{${prop}}`)
    ) {
      console.log(attr.value);
      let finalAttribute = attr.value.replaceAll(
        `${obj[prop]}`, 
        `${value}`
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