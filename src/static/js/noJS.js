export class NoJS {

    constructor(shadowDom) {
      this.self = shadowDom;
    }

    makeEvent = (evt, el) => {
      return makeEvent(
        this.self,
        evt,
        el
      )

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

export const makeEvent = (self, evt, el1) => {
      const fnEvents = replaceEventAttr(self.shadowRoot, evt, el1);
      fnEvents.forEach((f, ctr) => {
        // data-${evt}${ctr}="${f}" >>> data-click0="alertMe()"

        // converted event listener
        self.shadowRoot.querySelector(`[data-${evt}${ctr}="${f}"]`).addEventListener(`${evt}`, e => {
          console.log(self.alertMe(1444))
          //console.log(eval(`this.${f}`)) // execute function 
        })

      })
    }

export const replaceEventAttr = (sr, evt, el1) => {
      // replace attrs (click) -> data-click0
      // (input) -> data-input0

      const funcWithEvents = [];
      sr.querySelectorAll(`${el1}`).forEach(el => {
        if (el.attributes[0].name.includes(`${evt}`)) {
          const tempAttr = el.getAttribute(`(${evt})`);

          // create final event attr
          el.setAttribute(
            `data-${evt}${funcWithEvents.length}`, tempAttr
          )
          
          // get all the functions to execute in event listener
          if (el.getAttribute(`(${evt})`)) {
            funcWithEvents.push(el.getAttribute(`(${evt})`))
          }

          // remove once attributes has been replaced
          el.removeAttribute(`(${evt})`)
        }
      })
      return funcWithEvents
    }




export default {
  makeReactive,
  makeEvent,
  toHTML,
  toSimulate,
  replaceEventAttr,
  NoJS
}