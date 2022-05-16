import { strip, getVal } from '../utils.js';
import { settings } from '../enums.js';

export const htmlParser = async (...args: any[]) => {
  const [self, el] = args;
  // replace with real value {username} > johnny,
  const allVars = el.textContent?.match(/{[^{^}^\|]*}/gi);
  if (!allVars) {
    return;
  }
  for (let text of allVars) {
    text = text.trim();
    if (text) {
      const cleanVar: string = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const { res, get } = getVal(self, cleanVar);
      if (res) {
        el.innerHTML = el.innerHTML.replaceAll(
          text,
          `<lib-w data-var=${cleanVar}>${res}</lib-w>`
        );
      }
    }
  }
};
