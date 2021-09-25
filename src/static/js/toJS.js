
export const addDataBindAttr = (prop, el2) => {
    // add data-bind attr to those with requires interpolation {{variables}}
    const elements = ['div', 'span'];
    elements.forEach(el1 => {
      el2.querySelectorAll(el1).forEach(el => {
        for (let [k, v] of Object.entries(prop)) {
            if (el.textContent.includes(k)) {
                el.setAttribute('data-bind', k);
            }
        }
      })
    })
  }

export const makeReactive = (obj, el3) => {
    // react when there is a changes in value
    addDataBindAttr(
      obj,
      el3
    )

    let el1 = el3.querySelectorAll("[data-bind]");
    const handler = {
      get: (obj, prop) => {
        return obj[prop] ;
      },
      set: (obj, prop, value) => {
        el1.forEach((el) => {
          if (el.getAttribute("data-bind") == prop) {
            if (el.type && (el.type === "text" || el.type === "textarea")) {
              el.value = value;
            } else {
              // interpolate
              // {username} > johny<!--{username}-->
              el.innerHTML = el.innerHTML.replaceAll(`${obj[prop]}<!--{${prop}}-->`, `${value}<!--{${prop}}-->`)
            }
          }
        })
        obj[prop] = value;
        return true; 
      }
    }

    toHTML(
      obj,
      el3
    )


    return new Proxy(obj, handler);
}

export const toHTML = (prop, el3) => {
  if (prop) {
    let el1 = el3.querySelectorAll("[data-bind]");
    el1.forEach((el) => {
      for (let [k, v] of Object.entries(prop)) {
        // {username} > johnny<!--{username}-->
        el.innerHTML = el.innerHTML.replaceAll(`{${k}}`, `${v}<!--{${k}}-->`)
      }
    })

  }
}

export const toSimulate = (prop, el3) => {
  // add even listener to simulate 
  let el1 = el3.querySelectorAll("[data-bind]");
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

export default {
  makeReactive,
  toHTML,
  toSimulate,
  addDataBindAttr
}