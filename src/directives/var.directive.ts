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


const updateContent = async (...args: any[]) => {
  const [self, el] = args;
  const allVars = el.textContent?.match(/{[^{^}^\|]*}|\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi);
  let updated = false;
  console.log(allVars);
  if (!allVars) {   return { updated };  }
  for (let text of allVars) {
    text = text.trim();
    if (text) {
      const tmp = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const wPipe = tmp.split('|').length > 1;
      if (wPipe) {
        const cleanVar = tmp.split('|')[0].trim();
        const { res, get } = getVal(self, cleanVar);
        if (res !== '') {
          const { fRes, fPipes } = await runPipes(tmp, res);
          el.textContent = el.textContent.replaceAll(text, fRes);
        }
      } else {
        const { res, get } = getVal(self, tmp);
        if (res !== '') {
          el.textContent = el.textContent.replaceAll(text, res);
        }
      }
      updated = true;
    }
  }
  const newEl = el;
  return { updated, newEl };
};

export const varDirective = async (...args: any[]) => {
  let [self, el, prop, val] = args;
  const wComment = el.nodeType === 8;

  if (el.nodeName === '#text') {
    const clonedEl = el.cloneNode(true);
    const { updated  } = await updateContent(self, el);
    if (updated) {  genComment(el, clonedEl);  }
  } else if (wComment && el.data.includes('__var__')) {
    const clonedEl = globalThis.__var__[el.data.split('=')[1]]?.cloneNode(true);
    if (clonedEl) {
      const { updated, newEl  } = await updateContent(self, clonedEl);
      if (updated) {
        do {
          if (el.nextSibling.nodeType !== 8) {
            el.nextSibling.textContent = newEl.textContent;
            break;
          }
        } while (el = el.nextSibling); // not comment
      }
    }
  }
};
