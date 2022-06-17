import {genRef, updateContent, repVar} from '../common.js';

const COMMENT_VAR = '_v';
declare global {
  var _v: any;
}

export const varDirective = async (...args: any[]) => {
  const [self, el] = args;
  const wComment = el.nodeType === Node.COMMENT_NODE && el.data?.includes(COMMENT_VAR);
  const wText = el.nodeType === Node.TEXT_NODE;

  if (wText) {
    const refEl = el.cloneNode(true);
    const { rep  } = await repVar(self, el);
    if (rep) genRef(el, refEl, COMMENT_VAR); 
  } else if (wComment) {
    // use comment as reference
    const ref = el.data.split('=')[1];
    const refEl = globalThis[COMMENT_VAR][ref]?.cloneNode(true);
    if (refEl) {
      const { rep, newEl  } = await repVar(self, refEl);
      if (rep) updateContent(el, newEl);
    }
  }
};
