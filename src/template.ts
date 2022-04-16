import utils from './utils.js';
import { settings } from './enums.js';
import { Directives } from './directives.js';

export const updateVarAttrOnLoad = (
    self: HTMLElement,
    element: HTMLElement,
) => {
  for (const [_, attr] of Object.entries(element.attributes)) {
    const updatedFnArgs = updateEventFunctionArgs(self,
      attr.name,
      attr.value,
    );

    if (updatedFnArgs) {
      // data-onclick-kuqrlat7 suffix hash timestamp to make sure its unique event
      element.setAttribute(
        `data-${attr.name.replace(settings.ATTR_PREFIX, 'on')}-${(+new Date).toString(36)}`,
        updatedFnArgs
      );

      // remove @click attributes
      element.removeAttribute(`${attr.name}`);

    }
  }
};

export const updateVarHTMLOnLoad = (self: any, element: HTMLElement) => {
  // replace with real value {username} > johnny,
  element.innerHTML.split(' ').forEach(text => {
    if (getVar(text)) {
      const var1 = getVar(text)[0];
      const cleanVar: string = utils.strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const cmpAttr: any = Array.from(self.attributes).find((e: any) => e.name === cleanVar);
      let result = null;
      if (self[cleanVar] != undefined) { // applies to shadow var only
        result = self[cleanVar];
      } else if (self.__reactive[cleanVar] != undefined) { // applies for reactive variable
         result = self.__reactive[cleanVar];
      } else if (cmpAttr) { // applies to component var
        result = cmpAttr.value;
      }
      if (result) {
        element.innerHTML = element.innerHTML.replaceAll(
          var1,
          `${result}<!--${cleanVar}-->`
        );
      }
    }
  });
};

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
};

// extrac (variable1, variable2)
const getFunctionArgs = (value: string) => {
  return value.match(/\(.+\)/g)!;
};

const updateEventFunctionArgs = (self: any, attrName: string, attrVal: string) => {
  if (attrName.startsWith(settings.ATTR_PREFIX)) {
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
        cleanArg = utils.strip(arg, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      } else {
        arg = e.trim();
        cleanArg = e.trim();
      }

      // console.log(self[arg], arg, reactiveObj)
      if (parseInt(cleanArg)) {
        finalArgs.push(parseInt(cleanArg));
        commentArgs.push(parseInt(arg));
      } else if (cleanArg.startsWith('\'') || cleanArg === '$event') {
        // handling str args or $event args
        finalArgs.push(cleanArg); // if string remove "'1234'"
        commentArgs.push(arg);
      } else if (self[cleanArg] !== undefined) {
        finalArgs.push(self[cleanArg]);
        commentArgs.push(arg);
      } else if (self.__reactive[cleanArg] !== undefined) {
        finalArgs.push(self.__reactive[cleanArg]);
        commentArgs.push(arg);
      } else if (self[cleanArg] === undefined && self.__reactive[cleanArg] === undefined) {
        console.warn(`event args ${cleanArg} unable to parse ${attrVal}`);
        argsUpdateOk = false;
        return;
      }

    });

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
  let result;
  const commentArgs = utils.strip(attrVal, '/*', '*/');
  commentArgs.split(',').forEach( (val: string, index: number) => {
    if (val.startsWith(settings.VAR_PARSE.start) && val.endsWith(settings.VAR_PARSE.end) && prop == utils.strip(val, settings.VAR_PARSE.start, settings.VAR_PARSE.end)) {
      result = index;
    }
  });
  return result;
  // get Args location
};

const getOldArgs = (attrVal: string) => {
  const result = utils.strip(
    getFunctionArgs(attrVal)[0],
    '(', ')'
  );
  return result;
};


const getNewArgs = (oldArgs: string, argLocation: number, newVal: string) => {
  // get Value to update
  const result: any = [];
  oldArgs.split(',').forEach((val: string, index: number) => {
    if (index === argLocation) {
      result.push(utils.addQuote(newVal));
    } else {
      result.push(val);
    }
  });

  return result;
  // get Value to update

};

export const updateVarAttrOnChange = (
  element: HTMLElement,
  prop: string,
  value: string
) => {
  for (const [_, attr] of Object.entries(element.attributes)) {
    if (attr.name.startsWith('data-on') &&
        attr.value.includes(`{${prop}}`) // make sure to only update those with changes
    ) {

      const argLocation: any = getArgLocation(attr.value, prop);
      const oldArgs = getOldArgs(attr.value);
      const newArgs = getNewArgs(
        oldArgs,
        argLocation,
        value
      );

      const finalAttribute = attr.value.replaceAll(
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

export const updateTemplate = (self: any) => {
    // interpolate variable
    const allElements = self.shadowRoot.querySelectorAll('*');
    allElements.forEach( (el: any) => {
      const d = new Directives(self, el);
      el = d.apply();
      updateVarHTMLOnLoad(self, el);
      updateVarAttrOnLoad(self, el);
    });
};

export default {
  updateTemplate,
  updateVarHTMLOnChange,
  updateVarAttrOnChange
};
