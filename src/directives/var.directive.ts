import { strip, getVal } from '../utils.js';
import { settings } from '../enums.js';

declare global {
  var __var__: any;
}

const genComment = (...args: any[]) => {
  const [el, clonedEl] = args;
  // const clonedNode = el.cloneNode(true);
  const uniq = Math.floor(Math.random() * 1297234234795);
  globalThis.__var__ = {
    ...globalThis.__var__,
    [uniq] : clonedEl
  };
  const comment = document.createComment(`__var__=${uniq}`);
  el.parentNode.insertBefore(comment, el);
};


const updateContent = (...args: any[]) => {
  const [self, el] = args;
  const allVars = el.textContent?.match(/{[^{^}^\|]*}/gi);
  let updated = false;
  if (!allVars) {   return { updated };  }
  for (let text of allVars) {
    text = text.trim();
    if (text) {
      const cleanVar: string = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const { res, get } = getVal(self, cleanVar);
      if (res !== '') {
        el.textContent = el.textContent.replaceAll(text, res);
        updated = true;
      }
    }
  }
  const newEl = el;
  return { updated, newEl };
};

export const varDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  const wComment = el.nodeType === 8;

  if (el.nodeName === '#text') {
    const clonedEl = el.cloneNode(true);
    const { updated  } = updateContent(self, el);
    if (updated) {  genComment(el, clonedEl);  }
  } else if (wComment && el.data.includes('__var__')) {
    const node = globalThis.__var__[el.data.split('=')[1]].cloneNode(true);
    const { updated, newEl  } = updateContent(self, node);
    if (updated) {  el.nextSibling.textContent = newEl.textContent; }
  }
};
