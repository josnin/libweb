export class noJS {

    constructor(shadowDom, template) {
      this.self = shadowDom;
      this.self.attachShadow({mode: 'open'});
      this.self.shadowRoot.appendChild(template.content.cloneNode(true));

      makeEvent(this.self);

    }


    makeReactive = (prop) => {

      addDataBindAttr(
        this.self,
        prop
      );

      let properties = makeReactive(
        this.self,
        prop
      );

      toHTML(
        this.self,
        properties
      );

      addDataBindListener(this.self);

      return properties;

    }

}


export const addDataBindAttr = (self, prop) => {
    // add data-bind attr to those with requires interpolation {{variables}}
    self.shadowRoot.querySelectorAll('*').forEach(el => {
        for (let [k, v] of Object.entries(prop)) {
            if (el.textContent.includes(k)) {
                el.setAttribute(`data-bind`, k);
            }
        }
    })
  }

export const makeReactive = (self, obj) => {
    // react when there is a changes in value

    let el1 = self.shadowRoot.querySelectorAll("[data-bind]");
    const handler = {
      get: (obj, prop) => {
        return obj[prop] ;
      },
      set: (obj, prop, value) => {
        el1.forEach((el) => {
          if (el.type == 'text') {
            el.value = value;
          } else {
            // interpolate
            // {username} > johny<!--{username}-->
            el.innerHTML = el.innerHTML.replaceAll(`${obj[prop]}<!--{${prop}}-->`, `${value}<!--{${prop}}-->`)
          }
        })
        obj[prop] = value;
        return true; 
      }
    }


    return new Proxy(obj, handler);
}

export const toHTML = (self, prop) => {
  if (prop) {
    self.shadowRoot.querySelectorAll('*').forEach(el => {
      for (let [k, v] of Object.entries(prop)) {
        // {username} > johnny<!--{username}-->
        el.innerHTML = el.innerHTML.replaceAll(`{${k}}`, `${v}<!--{${k}}-->`)
      }
    })

  }
}

export const addDataBindListener = (self) => {
  // add any event data-bind listener
  let el1 = self.shadowRoot.querySelectorAll("[data-bind]");
  el1.forEach((el) => {
    if (el.type === "text") {
      el.addEventListener("input", (e) => {
        self.properties[e.target.getAttribute('data-bind')] = e.target.value;
      });
    }
  });
  // add any event data-bind listener
}

export const makeEvent = (self) => {
      const fnEvents = replaceEventAttr(self);
      fnEvents.forEach((fn) => {
        // data-${evt}${ctr}="${f}" >>> data-click0="alertMe()"

        // converted event listener
        self.shadowRoot.querySelector(`${fn.query}`).addEventListener(`${fn.event}`, e => {
          console.log(eval(`self.${fn.fn}`)) // execute function 
        })

      })
    }

export const replaceEventAttr = (self) => {
      // replace attrs (click) -> data-click0
      // (input) -> data-input0

      const fnEvents = [];
      self.shadowRoot.querySelectorAll('*').forEach(el => {
        //console.log('replaceEventAttr', el.attributes[0].name)
        if (el.attributes.length > 0 &&  el.attributes[0].name.startsWith('on')) {
         // const tempAttr = el.getAttribute(`(${evt})`);
         const attrName = el.attributes[0].name;
         const attrVal = el.attributes[0].value;
         const attrEvent = attrName.split('on')[1];

         // // create final event attr
         el.setAttribute(
            `data-${attrName}${fnEvents.length}`, attrVal
          );

          let tmp = {
            query: `[data-${attrName}${fnEvents.length}="${attrVal}"]`,
            fn: attrVal,
            event: attrEvent
          };

          fnEvents.push(tmp);

          // need to remove otherwise onclick will be recognized as an active event
          // though it value function is not define in global?
          el.removeAttribute(attrName); 

        }
      })
      return fnEvents;
    }




export default {
  makeReactive,
  makeEvent,
  toHTML,
  addDataBindListener,
  noJS
}