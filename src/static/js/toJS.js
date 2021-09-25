
export const makeReactive = (obj, el1) => {
    // react when there is a changes in value
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
    return new Proxy(obj, handler);
}

export const toHTML = (prop, el1) => {
  if (prop) {
    //let el1 = this.shadowRoot.querySelectorAll("[data-bind]");
    el1.forEach((el) => {
      for (let [k, v] of Object.entries(prop)) {
        // {username} > johnny<!--{username}-->
        el.innerHTML = el.innerHTML.replaceAll(`{${k}}`, `${v}<!--{${k}}-->`)
      }
    })

  }
}

export const toSimulate = (prop, el1) => {
  // add even listener to simulate 
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
  toSimulate
}