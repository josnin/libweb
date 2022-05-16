
export const boolAttrDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;

  if (el.dataset?.attr && prop) {
    const obj = JSON.parse(el.dataset.attr);
    for (const key in obj) {
      if (obj[key] === prop && typeof(val) === 'boolean') {
        const fVal = Function(`return ${val}`)();
        if (fVal) {
          el.setAttribute(key, ''); 
        } else {
          el.removeAttribute(key);
        }
      }
    }
  }

};
