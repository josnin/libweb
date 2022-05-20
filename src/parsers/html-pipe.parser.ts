import { getVarWPipe, strip, getVal } from '../utils.js';
import { Pipes } from '../pipes/pipes.js';
import { settings } from '../enums.js';

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

export const htmlPipeParser = async (...args: any[]) => {
  // replace with real value { username | upper } > JOHNNY,
  const [self, el] = args;
  const varWPipe = el.textContent?.match(/\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi);
  if (!varWPipe) {
    return;
  }

  for (let text of varWPipe) {
    text = text.trim();
    if (text) {
      const tmp = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const wPipe = tmp.split('|').length > 1;
      const cleanVar = tmp.split('|')[0].trim();
      const { res, get } = getVal(self, cleanVar);

      if (res !== '' && wPipe) {

        const { fRes, fPipes } = await runPipes(tmp, res);

        el.innerHTML = el.innerHTML.replaceAll(
          text,
          `<lib-w data-var=${cleanVar} data-pipe=${fPipes.join('|')}>${fRes}</lib-w>`
        );
      }
    }
  }
};
