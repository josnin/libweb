
export const createEventListener = (self: any) => {
  const fnEvents = getEventsAttrFn(self);
  fnEvents.forEach((fn: any) => {
    // converted event listener
    //self.shadowRoot.querySelector(`${fn.query}`).addEventListener(`${fn.event}`, e => {
    //  console.log(eval(`self.${fn.fn}`)) // execute function 
    //}, true)

    // use this approach to overwrite all listener instead of addEventListener
    self.shadowRoot.querySelector(`${fn.query}`)[`${fn.event}`] = (e: any) => {
      console.log(eval(`self.${fn.fn}`)) // execute function 
    };
  })
}

export const getEventsAttrFn = (self: any) => {
  // replace attrs onclick -> data-onclick
  const fnEvents: any = [];
  const allElements = self.shadowRoot.querySelectorAll('*');

  allElements.forEach((element: HTMLElement) => {
    for (let [_, attr] of Object.entries(element.attributes)) { 
      if (attr.name.startsWith('data-on')) {
        let tmp = {
          //query: `[data-${attrName}${fnEvents.length}="${attrVal}"]`,
          query: `[${attr.name}]`,
          fn: attr.value, // alertMe('johnny')
          event: attr.name.split('-')[1] // data-onclick-id1 --> onclick
        };
        fnEvents.push(tmp);
      }
    }
  })
  return fnEvents;
}

export default {
  createEventListener,
  getEventsAttrFn
}
