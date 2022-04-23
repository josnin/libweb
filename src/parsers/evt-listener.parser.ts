import { settings } from '../enums.js';

export const evtListenerParser = (self: any, el: any) => {
  Array.from(el.attributes).map( (e: any) => {
      if (e.name.startsWith(settings.ATTR_PREFIX)) {
        el[e.name.replace(settings.ATTR_PREFIX, 'on')] = ($event: any) => {
           eval(`self.${e.value.replaceAll('\'$event\'', '$event')}`); // execute function
        } 
      }
  })
  return el;
}