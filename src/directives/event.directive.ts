import { settings } from '../enums.js';

export const eventDirective = (self: any, el: any) => {
  Array.from(el.attributes).map( (e: any) => {
      if (e.name.startsWith(settings.ATTR_PREFIX)) {
        el[e.name.replace(settings.ATTR_PREFIX, 'on')] = ($event: any) => {
          try {
            // exec normal func
            Function(`this.self.${e.value.replaceAll('\'$event\'', 'this.$event')}`).call({self, $event});
          } catch {
            // exec direct js, i.e alert(1)
            Function(`${e.value.replaceAll('\'$event\'', 'this.$event')}`).call({$event});
          }
        };
      }
  });
  return el;
};
