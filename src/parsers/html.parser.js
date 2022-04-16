import { getVar, strip } from '../utils.js';
import { settings } from '../enums.js';
export const htmlParser = (self, element) => {
    // replace with real value {username} > johnny,
    debugger;
    element.innerHTML.split(' ').forEach(text => {
        if (getVar(text)) {
            const var1 = getVar(text)[0];
            const cleanVar = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
            const cmpAttr = Array.from(self.attributes).find((e) => e.name === cleanVar);
            let result = null;
            if (self[cleanVar] != undefined) { // applies to shadow var only
                result = self[cleanVar];
            }
            else if (self.__reactive[cleanVar] != undefined) { // applies for reactive variable
                result = self.__reactive[cleanVar];
            }
            else if (cmpAttr) { // applies to component var
                result = cmpAttr.value;
            }
            if (result) {
                element.innerHTML = element.innerHTML.replaceAll(var1, `${result}<!--${cleanVar}-->`);
            }
        }
    });
};
