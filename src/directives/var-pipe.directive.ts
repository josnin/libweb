import { strip, getVal } from '../utils.js';
import { settings } from '../enums.js';
import { Pipes } from '../pipes/pipes.js';

declare global {
  var __varpipe__: any;
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

const genComment = (...args: any[]) => {
  const [el, clonedEl] = args;
  // const clonedNode = el.cloneNode(true);
  const uniq = Math.floor(Math.random() * 1297234234795);
  globalThis.__varpipe__ = {
    ...globalThis.__varpipe__,
    [uniq] : clonedEl
  };
  const comment = document.createComment(`__var__=${uniq}`);
  el.parentNode.insertBefore(comment, el);
};


const updateContent = async (...args: any[]) => {
  const [self, el] = args;
  const varWPipe = el.textContent?.match(/\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi);
  let updated = false;
  if (!varWPipe) {   return { updated };  }
  for (let text of varWPipe) {
    text = text.trim();
    if (text) {
      const tmp = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const wPipe = tmp.split('|').length > 1;
      const cleanVar = tmp.split('|')[0].trim();
      const { res, get } = getVal(self, cleanVar);
      if (res !== '' && wPipe) {
        const { fRes, fPipes } = await runPipes(tmp, res);
        el.textContent = el.textContent.replaceAll(text, fRes);
        updated = true;
      }
    }
  }
  const newEl = el;
  return { updated, newEl };
};

export const varWPipeDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  const wComment = el.nodeType === 8;

  if (el.nodeName === '#text') {
    const clonedEl = el.cloneNode(true);
    const { updated  } = await updateContent(self, el);
    if (updated) {  genComment(el, clonedEl);  }
  } else if (wComment && el.data.includes('__varpipe__')) {
    const node = globalThis.__varpipe__[el.data.split('=')[1]].cloneNode(true);
    const { updated, newEl  } = await updateContent(self, node);
    if (updated) {  el.nextSibling.textContent = newEl.textContent; }
  }
};
