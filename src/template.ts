import utils from "./utils.js";

export const updateVarAttrOnLoad = (
    self: HTMLElement, 
    element: HTMLElement,
    reactiveObj: any,
) => {
  for (let [_, attr] of Object.entries(element.attributes)) { 
    let updatedFnArgs = updateEventFunctionArgs(self, 
      attr.name, 
      attr.value,
      reactiveObj
    );

    if (updatedFnArgs) {
      // data-onclick-kuqrlat7 suffix hash timestamp to make sure its unique event
      element.setAttribute(
        `data-${attr.name.replace('@', 'on')}-${(+new Date).toString(36)}`,  
        updatedFnArgs
      );

      // remove @click attributes
      element.removeAttribute(`${attr.name}`);

    }
  }
};

export const updateVarHTMLOnLoad = (self: any, element: HTMLElement, reactiveObj: any) => {
  // replace with real value {username} > johnny,
  element.innerHTML.split(' ').forEach(text => {
    if (getVar(text)) {
      const var1 = getVar(text)[0];
      const cleanVar: string = utils.strip(text, '{', '}');
      const cmpAttr: any = Array.from(self.attributes).find((e: any) => e.name === cleanVar);
      let result = null;
      if (self[cleanVar] != undefined) { // applies to shadow var only
        result = self[cleanVar];
      } else if(reactiveObj[cleanVar] != undefined) { // applies for reactive variable
         result = reactiveObj[cleanVar];
      } else if (cmpAttr) { // applies to component var
        result = cmpAttr.value;
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
  element: HTMLElement, 
  reactiveObj: any, 
  varName: string, 
  varValue: string
) => {
  element.innerHTML = element.innerHTML.replaceAll(
    `${reactiveObj[varName]}<!--${varName}-->`, 
    `${varValue}<!--${varName}-->`
  );
}

// extrac (variable1, variable2)
const getFunctionArgs = (value: string) => {
  return value.match(/\(.+\)/g)!;
};

const updateEventFunctionArgs = (self: any, attrName: string, attrVal: string, reactiveObj: any) => {
  if (attrName.startsWith('@')) {
    const functionArgs = utils.strip(
      getFunctionArgs(attrVal)[0],
      '(', ')'
    );
    const finalArgs: any = [];
    const commentArgs: any = [];
    let argsUpdateOk = true;
    functionArgs.split(',').forEach((e: any) => {
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
      let tmp: any = utils.addQuoteItems(finalArgs);
      tmp = `(${tmp})/*${commentArgs.join(',')}*/`;
      const result = attrVal.replaceAll(/\((.+)\)/g, `${tmp}`);
      return result;
    }
  }
};


const getArgLocation = (attrVal: string, prop: string) => {
  // get Args location
  let result = undefined;
  const commentArgs = utils.strip(attrVal, '/*', '*/');
  commentArgs.split(',').forEach( (val: string, index: number) => {
    if (val.startsWith('{') && val.endsWith('}') && prop == utils.strip(val, '{', '}')) {
      result = index;
    }
  })
  return result;
  // get Args location
}

const getOldArgs = (attrVal: string) => {
  const result = utils.strip(
    getFunctionArgs(attrVal)[0],
    '(', ')'
  );
  return result;
}


const getNewArgs = (oldArgs: string, argLocation: number, newVal: string) => {
  // get Value to update
  let result: any = [];
  oldArgs.split(',').forEach((val: string, index: number) => {
    if (index === argLocation) {
      result.push(utils.addQuote(newVal));
    } else {
      result.push(val);
    }
  })

  return result;
  // get Value to update

}

export const updateVarAttrOnChange = (
  element: HTMLElement, 
  prop: string, 
  value: string
) => {
  for (let [_, attr] of Object.entries(element.attributes)) { 
    if (attr.name.startsWith('data-on') && 
        attr.value.includes(`{${prop}}`) // make sure to only update those with changes
    ) {

      const argLocation: any = getArgLocation(attr.value, prop);
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
const getVar = (value: string) => {
  return value.match(/\{.+\}/g)!;
};

export const updateTemplate = (self: any, obj: any) => {
    // interpolate variable
    const allElements = <HTMLElement[]>self.shadowRoot.querySelectorAll('*');
    allElements.forEach(element => {
      updateVarHTMLOnLoad(self, element, obj);
      updateVarAttrOnLoad(
        self, 
        element,
        obj
      );
    })
};

export default {
  updateTemplate,
  updateVarHTMLOnChange,
  updateVarAttrOnChange
}