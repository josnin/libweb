import { settings } from '../enums.js';

export const evtListenerParser = (self: any, el: any) => {
  Array.from(el.attributes).map( (e: any) => {
      if (e.name.startsWith(settings.ATTR_PREFIX)) {
        el[e.name.replace(settings.ATTR_PREFIX, 'on')] = ($event: any) => {
          try {
            // exec normal func
            eval(`self.${e.value.replaceAll('\'$event\'', '$event')}`); 
          } catch {
            // exec direct js, i.e alert(1)
            eval(e.value);
          }
        } 
      }
  })
  return el;
}