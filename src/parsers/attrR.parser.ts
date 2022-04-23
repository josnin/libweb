
import utils from '../utils.js';
import { settings } from '../enums.js';

// extrac (variable1, variable2)
const getFunctionArgs = (value: string) => {
  return value.match(/\(.+\)/g)!;
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

export const attrReactive = (
  self: any,
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
  return element;
};
