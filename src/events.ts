import { settings } from './enums.js';

export const createEventListener = (self: any) => {
  const fnEvents = getEventsAttrFn(self);
  fnEvents.forEach((fn: any) => {
    // converted event listener
    // self.shadowRoot.querySelector(`${fn.query}`).addEventListener(`${fn.event}`, e => {
    //  console.log(eval(`self.${fn.fn}`)) // execute function
    // }, true)

    // use this approach to overwrite all listener instead of addEventListener
    self.shadowRoot.querySelector(`${fn.query}`)[`${fn.event}`] = ($event: any) => {
      eval(`self.${fn.fn.replaceAll('\'$event\'', '$event')}`); // execute function
    };
  });
};

export const getEventsAttrFn = (self: any) => {
  // replace attrs onclick -> data-onclick
  const fnEvents: any = [];
  const allElements = self.shadowRoot.querySelectorAll('*');

  allElements.forEach((element: HTMLElement) => {
    for (const [_, attr] of Object.entries(element.attributes)) {
      if (attr.name.startsWith(settings.ATTR_REPLACE)) {
        const tmp = {
          query: `[${attr.name}]`,
          fn: attr.value, // alertMe('johnny')
          event: attr.name.split('-')[1] // data-onclick-id1 --> onclick
        };
        fnEvents.push(tmp);
      }
    }
  });
  return fnEvents;
};

export default {
  createEventListener,
  getEventsAttrFn
};
