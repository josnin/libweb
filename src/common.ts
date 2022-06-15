import { Pipes } from './pipes/pipes.js';
import { strip, getVal } from './utils.js';
import { settings } from './enums.js';

export const runPipes = async (tmp: any, fRes: any) => {
  const fPipes: string[] = [];
  for (let pipeName of tmp.split('|').slice(1)) {
    pipeName = pipeName.trim();
    const pipes = new Pipes(fRes, pipeName);
    fRes = await pipes.apply();
    fPipes.push(pipeName);
  }

  return { fRes, fPipes };

};

export const genRef = (...args: any[]) => {
  const [el, refEl, refVar] = args;
  const ref = Math.floor(Math.random() * 1297234);
  // @ts-ignore: dynamic index?
  globalThis[refVar] = {
    // @ts-ignore: dynamic index?
    ...globalThis[refVar],
    [ref] : refEl
  };
  const comment = document.createComment(`${refVar}=${ref}`);
  el.parentNode.insertBefore(comment, el);
};

export const updateContent = (...args: any[]) => {
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

export const repVar = async (...args: any[]) => {
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
