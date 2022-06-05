
declare global {
  var __if__: any;
}

const hideEl = (el: any) => {
  const clonedNode = el.cloneNode(true);
  const uniq = Math.floor(Math.random() * 897234234795);
  globalThis.__if__ = {
    ...globalThis.__if__,
    [uniq] : clonedNode
  };
  const comment = document.createComment(`__if__=${uniq}`);
  el.parentNode.insertBefore(comment, el);
  el.remove();
};

const showEl = (...args: any[]) => {
  const [el, prop, val] = args;
  if (el.data.includes('__if__')) {
    const node = globalThis.__if__[el.data.split('=')[1]];
    if (node.dataset.if === prop && val === true) {
      el.parentNode.insertBefore(node, el);
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
    if (self[If] === false || self.__reactive[If] == false) { hideEl(el); }
  } else if (el.dataset?.if && el.dataset.if === prop && val === false) {
    hideEl(el);
  } else if (wComment) {
    showEl(el, prop, val);
  }
};
