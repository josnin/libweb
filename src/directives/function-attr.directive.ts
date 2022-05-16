
import { isFn, getFnVal } from '../utils.js';

export const fnAttrDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;

  if (el.dataset?.attr && prop) {
    const obj = JSON.parse(el.dataset.attr);
    for (const key in obj) {
      if (obj[key] === prop) {
        if (val && typeof(val) === 'string' && isFn(val)) {
            const { fnVal } = getFnVal(self, el, val);
            el.setAttribute(key, fnVal);
        }
      }
    }
  }

};
