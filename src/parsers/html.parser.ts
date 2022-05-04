import { strip, getVal } from '../utils.js';
import { settings } from '../enums.js';

export const htmlParser = async (self: any, el: HTMLElement) => {
  // replace with real value {username} > johnny,
  const allVars = el.textContent?.match(/{[^{^}^\|]*}/gi);
  if (!allVars) {
    return;
  }
  await allVars.forEach(async (text: any) => {
    text = text.trim();
    if (text) {
      const cleanVar: string = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const res = getVal(self, cleanVar);
      if (res) {
        el.innerHTML = el.innerHTML.replaceAll(
          text,
          `<lib-w data-var=${cleanVar}>${res}</lib-w>`
        );
      }
    }
  });
};
