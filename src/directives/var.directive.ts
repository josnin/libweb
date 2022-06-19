import {genRef, getVal, runPipes, updateContent, VarReplacer} from '../common.js';

const COMMENT_VAR = '_v';
declare global {
  var _v: any;
}

const fnReplacer = async (...args: any[]) => {
  const [self, el, text, cleanVar, wPipe, tmp] = args;
  const {res, get} = getVal(self, cleanVar);
  const wRes = res !== '';
  if (wPipe && wRes) {
    const {fRes, fPipes} = await runPipes(tmp, res);
    el.textContent = el.textContent.replaceAll(text, fRes);
    return true;
  } if (wRes) {
    el.textContent = el.textContent.replaceAll(text, res);
    return true;
  }
  return false;
};

export const varDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  const wComment = el.nodeType === Node.COMMENT_NODE && el.data?.includes(COMMENT_VAR);
  const wText = el.nodeType === Node.TEXT_NODE;

  if (wText) {
    const refEl = el.cloneNode(true);
    const varRep = new VarReplacer(self, el, fnReplacer);
    const {rep} = await varRep.apply();
    if (rep) { genRef(el, refEl, COMMENT_VAR); }
  } else if (wComment) {
    // use comment as reference
    const ref = el.data.split('=')[1];
    const refEl = globalThis[COMMENT_VAR][ref]?.cloneNode(true);
    if (refEl && refEl.textContent.includes(prop)) { // @todo not good way of checking prop
      const varRep = new VarReplacer(self, refEl, fnReplacer);
      const {rep, newEl} = await varRep.apply();
      if (rep) { updateContent(el, newEl); }
    }
  }
};
