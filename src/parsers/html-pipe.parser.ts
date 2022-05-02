import { getVarWPipe, strip, getVal } from '../utils.js';
import { Pipes } from '../pipes/pipes.js';
import { settings } from '../enums.js';

export const htmlPipeParser = (self: any, el: HTMLElement, prop: string, val: string) => {
  // replace with real value { username | upper } > JOHNNY,
  const varWPipe = el.textContent?.match(/\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi);
  if (!varWPipe) {
    return;
  }
  varWPipe.forEach( (text: any) => {
    text = text.trim();
    if (text) {
      const tmp = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const wPipe = tmp.split('|').length > 1;
      const cleanVar = tmp.split('|')[0].trim();
      let res = getVal(self, cleanVar);

      if (res && wPipe) {

        const pipeName = tmp.split('|')[1].trim();
        const pipes = new Pipes(res, pipeName);
        res = pipes.apply();

        el.innerHTML = el.innerHTML.replaceAll(
          text,
          `<span data-var="${cleanVar}" data-pipe=${pipeName}>${res}</span>`
        );
      }
    }
  });
};
