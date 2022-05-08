import { getVal } from '../utils.js';

const refreshList = async (...args: any[]) => {
  const [self, el, items, alias, uniq] = args;
  let wBegin = false;
  let wEnd = false;
  const res = getVal(self, items);
  await res.forEach(async ( v: any, idx: number) => {
    const el2 = el.cloneNode(true);
    await el2.childNodes.forEach( (chld: any) => {
      if (chld.dataset?.var) {
        chld.textContent = v[chld.dataset.var.split('.')[1]];
        chld.dataset.index = idx;
      }
    });

    // always reset
    delete el2.dataset.begin;
    delete el2.dataset.end;

    // tag begin / end
    if (idx === 0 && !wBegin) {
      el2.dataset.begin = true;
      wBegin = el2.dataset.begin;
    } else if (res.length - 1 === idx && !wEnd) {
      el2.dataset.end = true;
      wEnd = el2.dataset.end;
    }

    el2.dataset.uniq = uniq;
    el2.dataset.for = items;
    el2.dataset.alias = alias;
    // el2.dataset.index ?
    await el.parentNode?.insertBefore(el2, el);

  });
};

const clearExpired = async (...args: any[]) => {
  const [el, uniq] = args;
  if (el.parentNode?.childNodes) {
    Array.from(el.parentNode.childNodes).map( (e: any) => {
      if (e.dataset?.uniq && e.dataset.uniq !== uniq) {
        e.remove(); // map has no implication removing while looping compared to forEach?
      }
    });
  }
};

// <div For="i in items"> {i.x} </div>
export const forDirective = async (self: any, el: any, prop: string, val: string) => {
  const For = await el.getAttribute('*For');
  if (For) {
    const uniq = (+new Date).toString(36);
    let [alias, items] = For.split('in');
    items = items.trim();
    alias = alias.trim();
    el.dataset.uniq = 'l2rkqnta__'; // (+new Date).toString(36);
    el.removeAttribute('*For');

    await refreshList(self, el, items, alias, uniq);
    await clearExpired(el, uniq);
  } else if (el.dataset?.for && el.dataset?.begin) {
    const uniq = (+new Date).toString(36);
    const items = el.dataset.for;
    const alias = el.dataset.alias;

    await refreshList(self, el, items, alias, uniq);
    await clearExpired(el, uniq);

  }
};
