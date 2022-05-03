
export const ifDirective = async (self: any, el: any, prop: string, val: string) => {
  const If = await el.getAttribute('If');
  if (If && !self[If] && !self.__reactive[If]) {
    el.style.display = 'none';
  }
}