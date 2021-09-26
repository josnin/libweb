export class noJS {

    constructor(shadowDom) {
      this.self = shadowDom;
    }

    makeEvent = () => {
      ['button', 'input'].forEach(r => {
        makeEvent(
          this.self,
          r
        )
      })
    }

    makeReactive = (prop) => {
      return makeReactive(
        this.self,
        prop
      )
    }

}


export const addDataBindAttr = (self, prop) => {
    // add data-bind attr to those with requires interpolation {{variables}}
    const elements = ['div', 'span', 'button'];
    elements.forEach(el1 => {
      self.shadowRoot.querySelectorAll(el1).forEach(el => {
        for (let [k, v] of Object.entries(prop)) {
            if (el.textContent.includes(k)) {
                el.setAttribute(`data-bind`, k);
            }
        }
      })
    })
  }

export const makeReactive = (self, obj) => {
    // react when there is a changes in value
    console.log(self)
    addDataBindAttr(
      self,
      obj
    )

    let el1 = self.shadowRoot.querySelectorAll("[data-bind]");
    const handler = {
      get: (obj, prop) => {
        return obj[prop] ;
      },
      set: (obj, prop, value) => {
        el1.forEach((el) => {
          if (el.value) {
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

    toHTML(
      self,
      obj
    )


    return new Proxy(obj, handler);
}

export const toHTML = (self, prop) => {
  if (prop) {
    let el1 = self.shadowRoot.querySelectorAll("[data-bind]");
    el1.forEach((el) => {
      for (let [k, v] of Object.entries(prop)) {
        // {username} > johnny<!--{username}-->
        el.innerHTML = el.innerHTML.replaceAll(`{${k}}`, `${v}<!--{${k}}-->`)
      }
    })

  }
}

export const toSimulate = (self, prop) => {
  // add even listener to simulate 
  let el1 = self.shadowRoot.querySelectorAll("[data-bind]");
  el1.forEach((el) => {
    let propToBind = el.getAttribute("data-bind");
    if (el.type === "text") {
      el.addEventListener("input", (e) => {
        prop[propToBind] = e.target.value;  
      });
    } else {
      el.addEventListener("click", (e) => {
        //this.properties[propToBind] = 'default2'
        alert(prop.lastname)
      });
    }
  });
  // add even listener to simulate 
}

export const makeEvent = (self, el1) => {
      const fnEvents = replaceEventAttr(self, el1);
      fnEvents.forEach((fn) => {
        // data-${evt}${ctr}="${f}" >>> data-click0="alertMe()"

        // converted event listener
        self.shadowRoot.querySelector(`${fn.query}`).addEventListener(`${fn.event}`, e => {
          console.log(eval(`self.${fn.fn}`)) // execute function 
        })

      })
    }

export const replaceEventAttr = (self, el1) => {
      // replace attrs (click) -> data-click0
      // (input) -> data-input0

      const fnEvents = [];
      self.shadowRoot.querySelectorAll(el1).forEach(el => {
        if (el.attributes[0].name.startsWith('on')) {
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
  toSimulate,
  noJS
}