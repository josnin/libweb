import { getVal, isFn, getFnVal } from '../utils.js';

export const attrParser = async (self: any, el: HTMLElement) => {
  // const [self, el] = args; // @todo handling self any el HTML element??
  const attrObj: any = {};
  for (const [_, attr] of Object.entries(el.attributes)) {

    if (attr.name.startsWith('__')) {
      const fName = attr.name.split('__')[1];

      const { res, get } = getVal(self, attr.value);
      if (get && res && ['string', 'number'].includes(typeof(res))) { // string, numeric
        el.setAttribute(fName, res);
      } if (get && res && typeof(res) === 'boolean') { // boolean
        el.setAttribute(fName, '');
      } else if (!get && !isFn(res)) {  // boolean inline js
        const fVal = Function(`return ${res}`)();
        if (fVal && typeof(fVal) === 'boolean') { el.setAttribute(fName, ''); }
      } else if (!get && isFn(res)){ // function
        const { fnVal } = getFnVal(self, el, res);
        el.setAttribute(fName, fnVal);
      }

      el.removeAttribute(attr.name);
      attrObj[fName] = attr.value;
    }
  }
  if (Object.keys(attrObj).length > 0 ) {
    el.dataset.attr = JSON.stringify(attrObj);
  }
};
