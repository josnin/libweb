import { strip, getVal } from '../utils.js';
import { settings } from '../enums.js';
import { Pipes } from '../pipes/pipes.js';

declare global {
  var __var__: any;
}


const runPipes = async (tmp: any, fRes: any) => {
  const fPipes: string[] = [];
  for (let pipeName of tmp.split('|').slice(1)) {
    pipeName = pipeName.trim();
    const pipes = new Pipes(fRes, pipeName);
    fRes = await pipes.apply();
    fPipes.push(pipeName);
  }

  return { fRes, fPipes };

};

const createComment = (...args: any[]) => {
  const [el, clonedEl] = args;
  // const clonedNode = el.cloneNode(true);
  const ref = Math.floor(Math.random() * 1297234234795);
  globalThis.__var__ = {
    ...globalThis.__var__,
    [ref] : clonedEl
  };
  const comment = document.createComment(`__var__=${ref}`);
  el.parentNode.insertBefore(comment, el);
};


const updateContent = (...args: any[]) => {
  let [el, newEl] = args;
  const wComment = el.nextSibling !== 8;
  do {
    if (wComment) {
      el.nextSibling.textContent = newEl.textContent;
      break;
    }
   } while (el = el.nextSibling); // not comment

}


const createContent = async (...args: any[]) => {
  const [self, el] = args;
  const allVars = el.textContent?.match(/{[^{^}^\|]*}|\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi);
  let created = false;
  if (!allVars) {   return { created };  }
  for (let text of allVars) {
    text = text.trim();
    if (text) {
      const tmp = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const wPipe = tmp.split('|').length > 1;
      const cleanVar = tmp.split('|')[0].trim();
      const { res, get } = getVal(self, cleanVar);
      if (wPipe && res !== '') {
        const { fRes, fPipes } = await runPipes(tmp, res);
        el.textContent = el.textContent.replaceAll(text, fRes);
      } if (res !== '') {
        el.textContent = el.textContent.replaceAll(text, res);
      }
      created = true;
    }
  }
  const newEl = el;
  return { created, newEl };
};

export const varDirective = async (...args: any[]) => {
  let [self, el, prop, val] = args;
  const wComment = el.nodeType === 8;
  const wVar = el.data.includes('__var__');

  if (el.nodeName === '#text') {
    const clonedEl = el.cloneNode(true);
    const { created  } = await createContent(self, el);
    if (created) {  createComment(el, clonedEl);  }
  } else if (wComment && wVar) {
    // use comment as reference
    const ref = el.data.split('=')[1];
    const clonedEl = globalThis.__var__[ref]?.cloneNode(true);
    if (clonedEl) {
      const { created, newEl  } = await createContent(self, clonedEl);
      if (created) {  updateContent(el, newEl); }
    }
  }
};
