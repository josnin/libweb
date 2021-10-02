
export const createReactive = (self, varObj, createEventListener) => {
  // react when there is a changes in value
  //const allElements = self.shadowRoot.querySelectorAll('[data-bind]');
  const allElements = self.shadowRoot.querySelectorAll("*");
  const handler = {
    get: (varObj, prop) => {
      return varObj[prop] ;
    },
    set: (varObj, prop, value) => {
      allElements.forEach((element) => {
        if (element.type == 'text') {
          element.value = value;
        } else {
          // interpolate
          // {username} > johny<!--{username}-->
          updateReactiveVarHTMLOnChange(
            element, 
            varObj, 
            prop, 
            value
          );
          //el.innerHTML = el.innerHTML.replaceAll(`${obj[prop]}<!--{${prop}}-->`, `${value}<!--{${prop}}-->`)
          updateReactiveVarAttrOnChange(
            element, 
            varObj, 
            prop, 
            value
          );

          createEventListener(self);
        }
      })
      varObj[prop] = value;
      return true; 
    }
  }

  return new Proxy(varObj, handler);
}

export const updateReactiveVarHTMLOnLoad = (element, reactiveObj) => {
  // replace with real value {username} > johnny, applies on reactive variable
  for (let [varName, varValue] of Object.entries(reactiveObj)) {
    // {username} > johnny<!--{username}-->
    element.innerHTML = element.innerHTML.replaceAll(
      `{${varName}}`, 
      `${varValue}<!--{${varName}}-->`
    )
  };
};

export const updateReactiveVarAttrOnLoad = (element, reactiveObj) => {
  for (let [suffixID, attr] of Object.entries(element.attributes)) { 
    for (let [varName, varValue] of Object.entries(reactiveObj)) {
      // only applies for event attr
      if (attr.name.startsWith('@')) {  // @Todo use enum to define this
        let finalAttribute = attrVal.replaceAll(
            `{${varName}}`, 
            `'${varValue}'`
        );

        // data-onclick-id1 suffix counter to make use its unique event
        element.setAttribute(
            `data-${attrName.replace('@', 'on')}-id${suffixID}`,  
            `${finalAttribute};/*{${varName}}*/`
        );

        // remove @click attributes
        element.removeAttribute(`${attrName}`);
        //setAndRemoveEventAttr(
        //  element,
        //  attr.name,
        //  attr.value,
        //  suffixID,
        //  varName,
        //  varValue
        //)
      }
      // only applies for event attr
    }
  }
};

const updateReactiveVarHTMLOnChange = (
  element, 
  reactiveObj, 
  varName, 
  varValue
) => {
  element.innerHTML = element.innerHTML.replaceAll(
    `${reactiveObj[varName]}<!--{${varName}}-->`, 
    `${varValue}<!--{${varName}}-->`
  );
}

const updateReactiveVarAttrOnChange = (
  element, 
  obj, 
  prop, 
  value
) => {
  for (let [_, attr] of Object.entries(element.attributes)) { 
    if (attr.name.startsWith('data-on') && 
        attr.value.includes(`{${prop}}`)
    ) {
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
  createReactive,
  updateReactiveVarHTMLOnLoad,
  updateReactiveVarAttrOnLoad
}