// <div For="i in items"> {i.x} </div>
export const forDirective = async (self: any, el: any, prop: string, val: string) => {
  const For = await el.getAttribute('*For');
  if (For) {
    const [alias, items] = For.split('in');
    const res = Function(`return this.self.${items.trim()}`).call({self});
    // el.removeAttribute('*For');
    await res.forEach(async ( v: any, idx: number) => {
      const el2 = el.cloneNode(true);
      await el2.childNodes.forEach( (chld: any) => {
        if (chld.dataset?.var) {
          chld.textContent = v[chld.dataset.var.split('.')[1]];
          chld.dataset.index = idx;
        }
      });
      el.parentNode.insertBefore(el2, el2.nextSibling);
    });
    el.remove();
  }
};
