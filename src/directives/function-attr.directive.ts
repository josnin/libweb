
import { updateFnArgs, isFn } from "../utils.js";

export const fnAttrDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;

  if (el.dataset?.attr && prop) {
    const obj = JSON.parse(el.dataset.attr);
    for (const key in obj) {
      if (obj[key] === prop) {
        if (val && typeof(val) === 'string' && isFn(val)) {
          const args2 = val.split('(')[1].split(')')[0];
          const { fFn } = updateFnArgs(el, val.split('(')[0], args2)
          console.log('cccc', fFn)
        
          Function(`return this.self.${fFn}`).call({self});
 
        }
      }
    }
  }

};
