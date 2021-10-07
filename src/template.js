import utils from "./utils.js";

export const updateVarAttrOnLoad = (
    self, 
    element,
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
    if (getVar(text)) {
      const var1 = getVar(text)[0];
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

// extrac (variable1, variable2)
const getFunctionArgs = (value) => {
  return value.match(/\(.+\)/g);
};

const updateEventFunctionArgs = (self, attrName, attrVal, reactiveObj) => {
  if (attrName.startsWith('@')) {
    const functionArgs = utils.strip(
      getFunctionArgs(attrVal)[0],
      '(', ')'
    );
    const finalArgs = [];
    const commentArgs = [];
    let argsUpdateOk = true;
    functionArgs.split(',').forEach(e => {
      let arg = '';
      let cleanArg = '';
      if (getVar(e) != undefined) {
        arg = getVar(e)[0];
        cleanArg = utils.strip(arg, '{', '}');
      } else {
        arg = e.trim()
        cleanArg = e.trim();
      }

      //console.log(self[arg], arg, reactiveObj)
      if(parseInt(cleanArg)) {
        console.warn(`numeric args ${cleanArg} not req. to parse in function ${attrVal}`);
        finalArgs.push(parseInt(cleanArg));
        commentArgs.push(parseInt(arg));
      } else if (cleanArg.startsWith("'")) {
        // skip string args & numeric
        console.warn(`string args ${cleanArg} not req. to parse in function ${attrVal}`);
        finalArgs.push(cleanArg); // if string remove "'1234'"
        commentArgs.push(arg);
        //console.log(arg);
      } else if (self[cleanArg] != undefined) {
        finalArgs.push(self[cleanArg]);
        commentArgs.push(arg);
      } else if(reactiveObj[cleanArg] != undefined) {
        finalArgs.push(reactiveObj[cleanArg]);
        commentArgs.push(arg);
      } else if(self[cleanArg] == undefined || reactiveObj[cleanArg] == undefined) {
        console.warn(`args ${cleanArg} unable to parse in function ${attrVal}`);
        argsUpdateOk = false;
        return
      }

    })

    if (argsUpdateOk) {
      let tmp = utils.addQuoteItems(finalArgs);
      tmp = `(${tmp})/*${commentArgs.join(',')}*/`;
      const result = attrVal.replaceAll(/\((.+)\)/g, `${tmp}`);
      return result;
    }
  }
};


const getArgLocation = (attrVal, prop) => {
  // get Args location
  let result = undefined;
  const commentArgs = utils.strip(attrVal, '/*', '*/');
  commentArgs.split(',').forEach( (val, index) => {
    if (prop == utils.strip(val, '{', '}')) {
      result = index;
    }
  })
  return result;
  // get Args location
}

const getOldArgs = (attrVal) => {
  const result = utils.strip(
    getFunctionArgs(attrVal)[0],
    '(', ')'
  );
  return result;
}


const getNewArgs = (oldArgs, argLocation, newVal) => {
  // get Value to update
  let result = [];
  oldArgs.split(',').forEach((val, index) => {
    if (index == argLocation) {
      result.push(utils.addQuote(newVal));
    } else {
      result.push(val);
    }
  })

  return result;
  // get Value to update

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

      const argLocation = getArgLocation(attr.value, prop);
      const oldArgs = getOldArgs(attr.value);
      const newArgs = getNewArgs(
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

// extract {variable}
const getVar = (value) => {
  return value.match(/\{.+\}/g);
};

export default {
  updateVarHTMLOnLoad,
  updateVarAttrOnLoad,
  updateVarHTMLOnChange,
  updateVarAttrOnChange
}