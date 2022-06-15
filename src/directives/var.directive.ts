import { 
  genRef, 
  updateContent,
  repVar
} from '../common.js';


const _v = '_v';
declare global {
  var [_v]: any;
}


export const varDirective = async (...args: any[]) => {
  const [self, el] = args;
  const wComment = el.nodeType === 8 && el.data?.includes(_v);
  const wText = el.nodeName === '#text';

  if (wText) {
    const refEl = el.cloneNode(true);
    const { rep  } = await repVar(self, el);
    if (rep) genRef(el, refEl, _v); 
  } else if (wComment) {
    // use comment as reference
    const ref = el.data.split('=')[1];
    const refEl = globalThis._v[ref]?.cloneNode(true);
    if (refEl) {
      const { rep, newEl  } = await repVar(self, refEl);
      if (rep) updateContent(el, newEl);
    }
  }
};
