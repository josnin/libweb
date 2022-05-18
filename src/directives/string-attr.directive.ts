import { updateFnArgs, isFn } from "../utils.js";

export const strAttrDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;

  if (el.dataset?.attr && prop) {
    const obj = JSON.parse(el.dataset.attr);
    for (const key in obj) {
      if (obj[key] === prop) {
        if (val && (typeof(val) === 'string' && !isFn(val)) 
        || (typeof(val) === 'number')) {
          el.setAttribute(key, val); 
        }
      }
    }
  }

};
