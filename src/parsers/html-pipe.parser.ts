import { getVarWPipe, strip } from '../utils.js';
import { Pipes } from '../pipes/pipes.js';
import { settings } from '../enums.js';

export const htmlPipeParser = (self: any, element: HTMLElement) => {
  // replace with real value { username | upper } > JOHNNY,
  const varWPipe = element.textContent?.match(/\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi)
  if (!varWPipe) {
    return;
  }
  varWPipe.forEach( (text: any) => {
    text = text.trim();
    if (text) {
      const var1 = text;
      const tmp = strip(var1, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const wPipe = tmp.split('|').length > 1;
      const cleanVar = tmp.split('|')[0].trim();
      const cmpAttr: any = Array.from(self.attributes).find((e: any) => e.name === cleanVar);
      let res = null;

      // @todo reuse?
      if (self[cleanVar] !== undefined) { // applies to shadow var only
        res = self[cleanVar];
      } else if (self.__reactive[cleanVar] !== undefined) { // applies for reactive variable
        res = self.__reactive[cleanVar];
      } else if (cmpAttr) { // applies to component var
        res = cmpAttr.value;
      }

      if (res && wPipe) {

        const pipeName = tmp.split('|')[1].trim();
        const pipes = new Pipes(res, pipeName);
        res = pipes.apply();


        element.innerHTML = element.innerHTML.replaceAll(
          var1,
          `${res}<!--${var1}-->`
        );
      }
    }
  });
};
