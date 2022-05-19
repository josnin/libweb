import { getVarWPipe, strip, getVal } from '../utils.js';
import { Pipes } from '../pipes/pipes.js';
import { settings } from '../enums.js';

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
      let { res, get } = getVal(self, cleanVar);

      if (res !== '' && wPipe) {

        const pipeName = tmp.split('|')[1].trim();
        const pipes = new Pipes(res, pipeName);
        res = await pipes.apply();


        el.innerHTML = el.innerHTML.replaceAll(
          text,
          `<lib-w data-var=${cleanVar} data-pipe=${pipeName}>${res}</lib-w>`
        );
      }
    }
  }
};
