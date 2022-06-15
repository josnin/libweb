
import { 
  genRef
} from '../common.js';

const gVar = '_i';
declare global {
  var _i: any;
}


const hideEl = (el: any) => {
  const refEl = el.cloneNode(true);
  genRef(el, refEl, gVar);
  el.remove();
};

const showEl = (...args: any[]) => {
  const [el, prop, val] = args;
  const wIf = el.data?.includes(gVar);
  if (wIf) {
    const ref = el.data.split('=')[1];
    const refEl = globalThis[gVar][ref];
    if (refEl.dataset.if === prop && val === true) {
      el.parentNode.insertBefore(refEl, el);
      el.remove();
    }
  }
};


export const ifDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  const wAttr = [3, 8].includes(el.nodeType) === false;
  const wComment = el.nodeType === 8;
  const ifAttr = '*if';
  if (wAttr && el.getAttribute(ifAttr)) {
    const If = el.getAttribute(ifAttr);
    el.dataset.if = If;
    el.removeAttribute(ifAttr);
    if (self[If] === false || self.__reactive[If] == false) hideEl(el); 
  } else if (el.dataset?.if && el.dataset.if === prop && val === false) {
    hideEl(el);
  } else if (wComment) {
    showEl(el, prop, val);
  }
};
