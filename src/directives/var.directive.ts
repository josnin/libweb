import { strip, getVal } from '../utils.js';
import { settings } from '../enums.js';
import { Pipes } from '../pipes/pipes.js';

declare global {
  var _v: any;
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

const genRef = (...args: any[]) => {
  const [el, refEl] = args;
  // const clonedNode = el.cloneNode(true);
  const ref = Math.floor(Math.random() * 1297234);
  globalThis._v = {
    ...globalThis._v,
    [ref] : refEl
  };
  const comment = document.createComment(`_v=${ref}`);
  el.parentNode.insertBefore(comment, el);
};


const updateContent = (...args: any[]) => {
  // apply var replacment
  let [el, newEl] = args;
  const wComment = el.nextSibling !== 8;
  do {
    if (wComment) {
      el.nextSibling.textContent = newEl.textContent;
      break;
    }
   } while (el = el.nextSibling); // not comment

};


const repVar = async (...args: any[]) => {
  // replace {var}
  const [self, el] = args;
  // extract {var} or {var | json}
  const allVars = el.textContent?.match(/{[^{^}^\|]*}|\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi);
  let rep = false;
  if (!allVars) return { rep }; 
  for (let text of allVars) {
    text = text.trim();
    if (text) {
      const tmp = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const wPipe = tmp.split('|').length > 1;
      const cleanVar = tmp.split('|')[0].trim();
      const { res, get } = getVal(self, cleanVar);
      const wRes = res !== '';
      if (wPipe && wRes) {
        const { fRes, fPipes } = await runPipes(tmp, res);
        el.textContent = el.textContent.replaceAll(text, fRes);
        rep = true;
      } if (wRes) {
        el.textContent = el.textContent.replaceAll(text, res);
        rep = true;
      }
    }
  }
  const newEl = el;
  return { rep, newEl };
};

export const varDirective = async (...args: any[]) => {
  const [self, el] = args;
  const wComment = el.nodeType === 8;
  const wVar = el.data?.includes('_v');
  const wText = el.nodeName === '#text';

  if (wText) {
    const refEl = el.cloneNode(true);
    const { rep  } = await repVar(self, el);
    if (rep) genRef(el, refEl); 
  } else if (wComment && wVar) {
    // use comment as reference
    const ref = el.data.split('=')[1];
    const refEl = globalThis._v[ref]?.cloneNode(true);
    if (refEl) {
      const { rep, newEl  } = await repVar(self, refEl);
      if (rep) updateContent(el, newEl);
    }
  }
};
