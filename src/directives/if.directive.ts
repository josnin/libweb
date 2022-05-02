
export const ifDirective = (self: any, el: any, prop: string, val: string) => {
  const If = el.getAttribute('If');
  if (If && !self[If] && !self.__reactive[If]) {
    el.style.display = 'none';
  }
}