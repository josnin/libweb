import { getVal } from "../utils.js";

export const attrParser = async (...args: HTMLElement[]) => {
  const [self, el] = args;
  const attrObj: any = {};
  for (const [_, attr] of Object.entries(el.attributes)) {

    if (attr.name.startsWith(':')) {
      const fName = attr.name.split(':')[1];

      const { res, get } = getVal(self, attr.value); // for reactive?
      if (get && typeof(res) === 'string') {
        if (res) { el.setAttribute(fName, res); }
      } else if (!get) { 
        // inline js, not found in the variable
        const fVal = Function(`return ${res}`)();
        if (typeof(fVal) === 'boolean') {
          if (fVal) { el.setAttribute(fName, ''); }
        }
      } else if (false) { // function call?

      }
      el.removeAttribute(attr.name)
      attrObj[fName] = attr.value
    }
  }
  el.dataset.attr = JSON.stringify(attrObj);
};