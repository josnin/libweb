import { settings } from '../enums.js';
import { getVar, strip, addQuoteItems } from '../utils.js';

// extrac (variable1, variable2)
const getFunctionArgs = (value: string) => {
  return value.match(/\(.+\)/g)!;
};

const updateEventFunctionArgs = (self: any, attrName: string, attrVal: string) => {
  if (attrName.startsWith(settings.ATTR_PREFIX)) {
    const functionArgs = strip(
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
        cleanArg = strip(arg, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
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
      let tmp: any = addQuoteItems(finalArgs);
      tmp = `(${tmp})/*${commentArgs.join(',')}*/`;
      const result = attrVal.replaceAll(/\((.+)\)/g, `${tmp}`);
      return result;
    }
  }
};

export const attrEvtParser = (
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
      //element.setAttribute(
      //  `data-${attr.name.replace(settings.ATTR_PREFIX, 'on')}-${(+new Date).toString(36)}`,
      //  updatedFnArgs
      //);
      element.setAttribute(
        attr.name,
        updatedFnArgs
      );

      // remove @click attributes
      //element.removeAttribute(`${attr.name}`);

    }
  }
};
