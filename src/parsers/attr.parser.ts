import { getVal, isFn } from "../utils.js";

export const attrParser = async (self: any, el: HTMLElement) => {
  //const [self, el] = args; // @todo handling self any el HTML element??
  const attrObj: any = {};
  for (const [_, attr] of Object.entries(el.attributes)) {

    if (attr.name.startsWith(':')) {
      const fName = attr.name.split(':')[1];

      const { res, get } = getVal(self, attr.value); 
      if (get && res && typeof(res) === 'string') { // string
        el.setAttribute(fName, res); 
      } else if (!get && !isFn(res)) {  // boolean
        // inline js, not found in the variable
        const fVal = Function(`return ${res}`)();
        if (fVal && typeof(fVal) === 'boolean') { el.setAttribute(fName, ''); }
      } else if (!get && isFn(res)){ // function
        const fVal = Function(`return this.self.${res}`).call({self});
        el.setAttribute(fName, fVal)
      }
      el.removeAttribute(attr.name)
      attrObj[fName] = attr.value
    }
  }
  if (Object.keys(attrObj).length > 0 ) {
    el.dataset.attr = JSON.stringify(attrObj);
  }
};