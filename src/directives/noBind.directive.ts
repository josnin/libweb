
export const noBindDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  const noBind = el.getAttribute('nobind');
  if (noBind != null) {
    el.removeAttribute('nobind');
    el.dataset.nobind = '';

    for (const chld of el.childNodes) {
      if (chld.dataset?.var) {
        if (chld.dataset?.pipe) {
          chld.textContent =  `{${chld.dataset.var} | ${chld.dataset.pipe}}`;
        } else {
          chld.textContent =  `{${chld.dataset.var}}`;
        }
      }
    }
  }
};
