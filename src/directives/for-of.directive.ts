import {getVal, updateContent, stripParenthesis, VarReplacer} from '../common.js';

const OF = 'of';
const FOR_ATTR = '*for';

const setReplacer = async (...args: any[]) => {
  const [self, el, text, cleanVar, wPipe, tmp, forObj] = args;
  const {alias, obj, index, idx, v} = forObj;
  if (cleanVar.match(/\./)?.length === 1) { // {x.name}
    const [itemVar, itemVal] = cleanVar.split('.');
    if (alias === itemVar) {
      obj[alias] = v;
      if (obj[alias][itemVal]) {
        el.textContent = el.textContent.replaceAll(text, obj[alias][itemVal]);
        return true;
      }
    }
  } else if (alias === cleanVar) {
      if (v) {
        el.textContent = el.textContent.replaceAll(text, v);
        return true;
      }
  } else if (index === cleanVar) {
      if (idx) {
        el.textContent = el.textContent.replaceAll(text, idx);
        return true;
      }
  }
  return false;
};

const getAliasItemsIndex = (...args: any[]) => {
  const [forOf] = args;
  let [tmp, items] = forOf.split(OF);
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

// tag begin / end
const tag = (...args: any[]) => {
  let [res, el2, idx, wBegin, wEnd] = args;
  if (idx == 0 && !wBegin) { // for...of index return string???
    el2.dataset.begin = true;
    wBegin = el2.dataset.begin;
  } else if (res.length - 1 === idx && !wEnd) {
    el2.dataset.end = true;
    wEnd = el2.dataset.end;
  }

};

// refresh list
const refreshEl =  async (...args: any[]) => {
  const [self, el, ref] = args;
  const {alias, index, for: items} = el.dataset;
  const wBegin = false;
  const wEnd = false;
  const { res, get } = getVal(self, items);
  for (const [idx, v] of Object.entries(res)) { // for..of index returns string?
    const el2 = el.cloneNode(true);
    const obj = {} as any;
    for (const chld of el2.childNodes) {
      const wComment = chld.nodeType === Node.COMMENT_NODE && chld.data?.includes('_v');
      if (wComment) {
        const ref = chld.data.split('=')[1];
        const refEl = globalThis._v[ref]?.cloneNode(true);
        if (refEl) {
          const varRep = new VarReplacer(self, refEl, setReplacer);
          varRep.forObj = {
            alias, index, obj, idx, v
          };
          const {rep, newEl} = await varRep.apply();
          if (rep) { updateContent(chld, newEl); }
        }
      }
    }
    el2.dataset.ref1 = ref;
    tag(res, el2, idx, wBegin, wEnd);

    el.parentNode?.insertBefore(el2, el);

  }
};

// clear expired list
const clearEl = (...args: any[]) => {
  const [el, ref] = args;
  const {for: items, alias} = el.dataset;
  if (el.parentNode?.childNodes) {
    Array.from(el.parentNode.childNodes).map( (e: any) => {
      // check dataset begin to make sure wont clea unrelated items
      if (e.dataset?.begin) { return; }

      // map has no implication removing while looping compared to forEach?
      if (e.dataset?.ref1 && e.dataset.ref1 !== ref &&
        e.dataset?.for && e.dataset.for === items && e.dataset.alias === alias) {
        e.innerHTML = '';
        // e.remove(); // @todo this remove all nodes?
      }
    });
  }
};

// <div *for="(k, v) of items"> {v.id} {v.name} </div>
export const forOfDirective = async (self: any, el: any, prop: string, val: string) => {
  const wTxtComnt = [Node.TEXT_NODE, Node.COMMENT_NODE].includes(el.nodeType);
  if (wTxtComnt) { return; }
  const forOf = el.getAttribute(FOR_ATTR);
  if (forOf) {
    const ref = Math.floor(Math.random() * 8972342);
    const { index, alias, items} = getAliasItemsIndex(forOf);
    el.dataset.ref1 = 'l2rkqnta__';
    el.dataset.for = items;
    el.dataset.alias = alias;
    el.dataset.index = index;
    el.removeAttribute(FOR_ATTR);

    refreshEl(self, el, ref);
    clearEl(el, ref);
    // clearEl(el, ref, items, alias);
  } else if (el.dataset?.for && el.dataset?.begin && el.dataset.for === prop) {
    const ref = Math.floor(Math.random() * 8972342);
    delete el.dataset.begin; // set to expired
    delete el.dataset.end;

    refreshEl(self, el, ref);
    clearEl(el, ref);

  }
};

