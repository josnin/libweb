const updateContent = (...args: any[]) => {
  const [el] = args;
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

export const noBindDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  const wTxtComnt = [3, 8].includes(el.nodeType);
  if (wTxtComnt) { return }
  const noBind = el.getAttribute('nobind');
  if (noBind != null) {
    el.removeAttribute('nobind');
    el.dataset.nobind = '';
    updateContent(el)
  } else if(el.dataset?.nobind != null) {
    updateContent(el)
  }
};
