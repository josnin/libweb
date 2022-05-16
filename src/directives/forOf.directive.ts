import { getVal, stripParenthesis } from '../utils.js';

const getAliasItemsIndex = (...args: any[]) => {
  const [forOf] = args;
  let [tmp, items] = forOf.split('of');
  let alias, index;

  if (tmp.match(/\(.+\)/)?.length > 0) {
    [index, alias] = stripParenthesis(tmp.match(/\(.+\)/)).split(',');
  } else {
    alias = tmp;
  }

  items = items.trim();
  alias = (alias) ? alias.trim() : '';

  return { items, alias, index };

};

const tagBeginEnd = (...args: any[]) => {
    // tag begin / end
  let [res, el2, idx, wBegin, wEnd] = args;
  if (idx == 0 && !wBegin) { // for...of index return string???
    el2.dataset.begin = true;
    wBegin = el2.dataset.begin;
  } else if (res.length - 1 === idx && !wEnd) {
    el2.dataset.end = true;
    wEnd = el2.dataset.end;
  }

};

const refreshList =  (...args: any[]) => {
  const [self, el, uniq] = args;
  const { alias, index, for: items } = el.dataset;
  const wBegin = false;
  const wEnd = false;
  const { res, get } = getVal(self, items);
  for (const [idx, v] of Object.entries(res)) { // for..of index returns string?
    const el2 = el.cloneNode(true);
    const obj = {} as any;
    for (const chld of el2.childNodes) {
      if (chld.dataset?.var) {
        if (chld.dataset.var.match(/\./)?.length === 1) { // {x.name}
          const [itemVar, itemVal] = chld.dataset.var.split('.');
          if (alias === itemVar) {
            obj[alias] = v;
            if (obj[alias][itemVal]) {  chld.textContent = obj[alias][itemVal]; }
          }
        } else if (alias === chld.dataset.var) {
            if (v) { chld.textContent = v };
        } else if (index === chld.dataset.var) {
            if (idx) { chld.textContent = idx };
        }
      }
    }
    el2.dataset.uniq = uniq;
    tagBeginEnd(res, el2, idx, wBegin, wEnd);

    el.parentNode?.insertBefore(el2, el);

  }
};

const clearExpired = (...args: any[]) => {
  const [el, uniq] = args;
  const { for: items, alias } = el.dataset;
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
export const forOfDirective = async (self: any, el: any, prop: string, val: string) => {
  const forOf = el.getAttribute('*For');
  if (forOf) {
    const uniq = (+new Date).toString(36);
    const { index, alias, items} = getAliasItemsIndex(forOf);
    el.dataset.uniq = 'l2rkqnta__'; // (+new Date).toString(36);
    el.dataset.for = items;
    el.dataset.alias = alias;
    el.dataset.index = index;
    el.removeAttribute('*For');

    refreshList(self, el, uniq);
    clearExpired(el, uniq, items, alias);
  } else if (el.dataset?.for && el.dataset?.begin && el.dataset.for === prop) {
    const uniq = (+new Date).toString(36);
    delete el.dataset.begin; // set to expired
    delete el.dataset.end;

    refreshList(self, el, uniq);
    clearExpired(el, uniq);

  }
};

