import { getVar, strip } from '../utils.js';
import { settings } from '../enums.js';

export const htmlParser = (self: any, element: HTMLElement) => {
  // replace with real value {username} > johnny,
  const allVars = element.textContent?.match(/{[^{^}^\|]*}/gi)!;
  if (!allVars) {
    return;
  }
  allVars.forEach( (text: any) => {
    text = text.trim();
    if (text) {
      const var1 = text
      const cleanVar: string = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
      const cmpAttr: any = Array.from(self.attributes).find((e: any) => e.name === cleanVar);
      let result = null;
      if (self[cleanVar] != undefined) { // applies to shadow var only
        result = self[cleanVar];
      } else if (self.__reactive[cleanVar] != undefined) { // applies for reactive variable
         result = self.__reactive[cleanVar];
      } else if (cmpAttr) { // applies to component var
        result = cmpAttr.value;
      }
      if (result) {
        element.innerHTML = element.innerHTML.replaceAll(
          var1,
          `${result}<!--${cleanVar}-->`
        );
      }
    }
  });
};
