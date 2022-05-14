
export const ifDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  const If = el.getAttribute('*if');
  if (If && !self[If] && !self.__reactive[If]) {
    el.removeAttribute('*if');
    el.dataset.if = '';
    el.style.display = 'none';
  }
}