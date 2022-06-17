import {getVal, isFn, getFnVal} from '../common.js';

export const attrParser = async (self: any, el: HTMLElement) => {
  // const [self, el] = args; // @todo handling self any el HTML element??
  const attrObj: any = {};
  for (const [_, attr] of Object.entries(el.attributes)) {

    if (attr.name.startsWith('__')) {
      const fName = attr.name.split('__')[1];

      const {res, get} = getVal(self, attr.value);
      const isStrNum = (get && res !== '' && ['string', 'number'].includes(typeof(res)));
      const isBoolean = (get && res === true && typeof(res) === 'boolean');
      const isInlineJs = (!get && !isFn(res)); // boolean inline js
      const isFunc = (!get && isFn(res));
      if (isStrNum) {
        el.setAttribute(fName, res);
      } if (isBoolean) { // boolean
        el.setAttribute(fName, '');
      } else if (isInlineJs) {
        const fVal = Function(`return ${res}`)();
        if (fVal === true && typeof(fVal) === 'boolean') { el.setAttribute(fName, ''); }
      } else if (isFunc){
        const {fnVal} = getFnVal(self, el, res);
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
