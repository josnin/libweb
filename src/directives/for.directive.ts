import { getVal } from "../utils.js";

// <div For="i in items"> {i.x} </div>
export const forDirective = async (self: any, el: any, prop: string, val: string) => {
  const For = await el.getAttribute('*For');
  if (For) {
    let [alias, items] = For.split('in');
    items = items.trim();
    alias = alias.trim();
    const res = getVal(self, items);
    // el.removeAttribute('*For');
    el.dataset.uniq = 'l2rkqnta__'; // whatever?
    const uniq = (+new Date).toString(36);

    // refresh list?
    await res.forEach(async ( v: any, idx: number) => {
      const el2 = el.cloneNode(true);
      await el2.childNodes.forEach( (chld: any) => {
        if (chld.dataset?.var) {
          chld.textContent = v[chld.dataset.var.split('.')[1]];
          chld.dataset.index = idx;
        }
      });
      el2.dataset.uniq = uniq;
      //el2.dataset.for = items;
      //el2.dataset.alias = alias;
      el.parentNode?.insertBefore(el2, el.nextSibling);
    });

    // clear expired list
    await el.parentNode?.childNodes.forEach( (e: any) => {
      if (e.dataset?.uniq && e.dataset.uniq !== uniq) {
        e.remove();
      }
    });
  }
};
