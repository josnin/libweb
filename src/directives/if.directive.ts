
export const ifDirective = (self: any, el: any, prop: string, val: string) => {
  const _If = el.getAttribute('_if');
  if (_If && !self[_If] && !self.__reactive[_If]) {
    el.style.display = 'none';
  }
  return el;
}