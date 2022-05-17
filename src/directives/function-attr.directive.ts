
import { isFn, getFnVal, getFnArgs } from '../utils.js';

export const fnAttrDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;

  if (el.dataset?.attr && prop) {
    // data-attr="{"style":"resize(hw)"}"
    const obj = JSON.parse(el.dataset.attr);
    for (const key in obj) {
      if (obj[key] && typeof(obj[key]) === 'string' && isFn(obj[key])) {
        const { fnArgs } = getFnArgs(obj[key]);
        if (fnArgs.split(',').includes(prop)) {
          const { fnVal } = getFnVal(self, el, obj[key]);
          el.setAttribute(key, fnVal);
        }
      }
    }
  }

};
