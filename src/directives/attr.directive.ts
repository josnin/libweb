import {isFn, getFnVal, getFnArgs} from '../common.js';

export const attrDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;

  if (el.dataset?.attr && prop) {
    const obj = JSON.parse(el.dataset.attr);
    for (const key in obj) {
      const isBoolean =  (obj[key] === prop && typeof(val) === 'boolean');
      const isFunc = (typeof(obj[key]) === 'string' && isFn(obj[key]));
      const isStrNum = (typeof(val) === 'string' && !isFn(val) || (typeof(val) === 'number'));
      if (isBoolean) {
        const fVal = Function(`return ${val}`)();
        if (fVal === true) {
          el.setAttribute(key, ''); 
        } else {
          el.removeAttribute(key);
        }
      } if (isFunc) {
        const { fnArgs } = getFnArgs(obj[key]);
        if (fnArgs.split(',').includes(prop)) {
          const { fnVal } = getFnVal(self, el, obj[key]);
          el.setAttribute(key, fnVal);
        }
      } if (obj[key] === prop) {
        if (isStrNum) {
          el.setAttribute(key, val); 
        }
      }
    }
  }

};

