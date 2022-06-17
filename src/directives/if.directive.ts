
import {genRef} from '../common.js';

const IF_ATTR = '*if';
const COMMENT_VAR = '_i';
declare global {
  var _i: any;
}


const hideEl = (el: any) => {
  const refEl = el.cloneNode(true);
  genRef(el, refEl, COMMENT_VAR);
  el.remove();
};

const showEl = (...args: any[]) => {
  const [el, prop, val] = args;
  const wIf = el.data?.includes(COMMENT_VAR);
  if (wIf) {
    const ref = el.data.split('=')[1];
    const refEl = globalThis[COMMENT_VAR][ref];
    if (refEl.dataset.if === prop && val === true) {
      el.parentNode.insertBefore(refEl, el);
      el.remove();
    }
  }
};


export const ifDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  const wAttr = el.nodeType === Node.ELEMENT_NODE && el.getAttribute(IF_ATTR);
  const wComment = el.nodeType === Node.COMMENT_NODE;
  if (wAttr) {
    const If = el.getAttribute(IF_ATTR);
    el.dataset.if = If;
    el.removeAttribute(IF_ATTR);
    if (self[If] === false || self.__reactive[If] == false) hideEl(el); 
  } else if (el.dataset?.if && el.dataset.if === prop && val === false) {
    hideEl(el);
  } else if (wComment) {
    showEl(el, prop, val);
  }
};
