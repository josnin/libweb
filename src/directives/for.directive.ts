import { getVal } from '../utils.js';

const tagBeginEnd = (...args: any[]) => {
    // tag begin / end
  let [res, el2, idx, wBegin, wEnd] = args;
  if (idx === 0 && !wBegin) {
    el2.dataset.begin = true;
    wBegin = el2.dataset.begin;
  } else if (res.length - 1 === idx && !wEnd) {
    el2.dataset.end = true;
    wEnd = el2.dataset.end;
  }

};

const refreshList =  (...args: any[]) => {
  const [self, el, items, alias, uniq] = args;
  const wBegin = false;
  const wEnd = false;
  const res = getVal(self, items);
  el.dataset.for = items;
  el.dataset.alias = alias;
  // el.dataset.index ?
  res.forEach((v: any , idx: any) => {
    const el2 = el.cloneNode(true);
    let obj = {} as any;
    el2.childNodes.forEach( (chld: any) => {
      if (chld.dataset?.var) {
        const [itemVar, itemVal] = chld.dataset.var.split('.');
        if (alias === itemVar) {
          obj[alias] = v;
          chld.textContent = obj[alias][itemVal];
          chld.dataset.index = idx;
        }
      }
    });
    el2.dataset.uniq = uniq;
    tagBeginEnd(res, el2, idx, wBegin, wEnd);

    el.parentNode?.insertBefore(el2, el);

  });
};

const clearExpired = (...args: any[]) => {
  const [el, uniq, items, alias] = args;
  if (el.parentNode?.childNodes) {
    Array.from(el.parentNode.childNodes).map( (e: any) => {
      // check dataset begin to make sure wont clea unrelated items
      if (e.dataset?.begin) { return; }

      // map has no implication removing while looping compared to forEach?
      if (e.dataset?.uniq && e.dataset.uniq !== uniq &&
        e.dataset?.for && e.dataset.for === items && e.dataset.alias === alias) {
        e.remove();
      }
    });
  }
};

// <div For="i in items"> {i.x} </div>
export const forDirective = async (self: any, el: any, prop: string, val: string) => {
  const For = el.getAttribute('*For');
  if (For) {
    const uniq = (+new Date).toString(36);
    let [alias, items] = For.split('in');
    items = items.trim();
    alias = alias.trim();
    el.dataset.uniq = 'l2rkqnta__'; // (+new Date).toString(36);
    el.removeAttribute('*For');

    refreshList(self, el, items, alias, uniq);
    clearExpired(el, uniq, items, alias);
  } else if (el.dataset?.for && el.dataset?.begin && el.dataset.for === prop) {
    const uniq = (+new Date).toString(36);
    const items = el.dataset.for;
    const alias = el.dataset.alias;
    delete el.dataset.begin; // set to expired
    delete el.dataset.end;

    refreshList(self, el, items, alias, uniq);
    clearExpired(el, uniq, items, alias);

  }
};
