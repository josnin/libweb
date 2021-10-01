export class noJS {

    constructor(shadowDom, template) {
      this.self = shadowDom;
      this.self.attachShadow({mode: 'open'});
      this.self.shadowRoot.appendChild(template.content.cloneNode(true));

      // interpolate variable
      toHTML(this.self);

      // create event listener?
      createEventListener(this.self);

    }


    makeReactive = (variable) => {
      const allElements = this.self.shadowRoot.querySelectorAll('*');
      allElements.forEach(element => {
        //addDataBindAttr(element, variable);
        updateReactiveVariableHTMLOnLoad(element, variable);
        updateReactiveVariableAttrOnLoad(element, variable);
      })

      // add data-bind listener and variable to react when there is an event
      addDataBindListener(this.self);

      // create event listener?
      createEventListener(this.self);

      // make variable reactive
      return makeReactive(this.self, variable);

    }

}


//const addDataBindAttr = (element, variable) => {
//  // add data-bind attr to those with requires interpolation {{variables}}
//  // applies only for reactive variable?
//  for (let [varName, _] of Object.entries(variable)) {
//      if (element.textContent.includes(varName)) {
//          element.setAttribute(`data-bind`, varName);
//      }
//  }
//}

const makeReactive = (self, obj) => {
  // react when there is a changes in value
  //const allElements = self.shadowRoot.querySelectorAll('[data-bind]');
  const allElements = self.shadowRoot.querySelectorAll("*");
  const handler = {
    get: (obj, prop) => {
      return obj[prop] ;
    },
    set: (obj, prop, value) => {
      allElements.forEach((element) => {
        if (element.type == 'text') {
          element.value = value;
        } else {
          // interpolate
          // {username} > johny<!--{username}-->
          updateReactiveVariableHTMLOnChange(element, obj, prop, value);
          //el.innerHTML = el.innerHTML.replaceAll(`${obj[prop]}<!--{${prop}}-->`, `${value}<!--{${prop}}-->`)
          updateReactiveVariableAttrOnChange(element, obj, prop, value);
          createEventListener(self);
        }
      })
      obj[prop] = value;
      return true; 
    }
  }

  return new Proxy(obj, handler);
}

export const toHTML = (self) => {
  const allElements = self.shadowRoot.querySelectorAll('*');
  allElements.forEach(element => {
    updateVariableHTMLOnLoad(self, element);
    updateVariableAttrOnLoad(self, element);
  })
};

const updateVariableAttrOnLoad = (self, element) => {
  for (let [k, attr] of Object.entries(element.attributes)) { 
    let variable = attr.value.split('{')[1]?.split('}')[0];
    if (self[variable] != undefined) {
      let finalAttribute = attr.value.replaceAll(`{${variable}}`, `'${self[variable]}'`);
      element.setAttribute(`data-${attr.name}`, `${finalAttribute};/* {${variable}} */`);
    }
  }
};

const updateVariableHTMLOnLoad = (self, element) => {
  // replace with real value {username} > johnny, applies on non-reactive variable
  element.textContent.split(' ').forEach(text => {
    if (text.startsWith('{') && text.endsWith('}')) {
      let variable = text.split('{')[1].split('}')[0];
      if (self[variable] != undefined) {
        element.innerHTML = element.innerHTML.replaceAll(text, self[variable])
      }
    }
  })
}

const updateReactiveVariableHTMLOnLoad = (element, reactiveObj) => {
  // replace with real value {username} > johnny, applies on reactive variable
  for (let [varName, varValue] of Object.entries(reactiveObj)) {
    // {username} > johnny<!--{username}-->
    element.innerHTML = element.innerHTML.replaceAll(`{${varName}}`, `${varValue}<!--{${varName}}-->`)
  };
};

const updateReactiveVariableAttrOnLoad = (element, reactiveObj) => {
  for (let [_, attr] of Object.entries(element.attributes)) { 
    for (let [varName, varValue] of Object.entries(reactiveObj)) {
      if (attr.name.startsWith('on')) {
        let finalAttribute = attr.value.replaceAll(`{${varName}}`, `'${varValue}'`);
        console.log(finalAttribute, attr.name, attr.value)
        element.setAttribute(`data-${attr.name}`, `${finalAttribute};/* {${varName}} */`);
      }
    }
  }
};

const updateReactiveVariableHTMLOnChange = (element, reactiveObj, varName, varValue) => {
  element.innerHTML = element.innerHTML.replaceAll(`${reactiveObj[varName]}<!--{${varName}}-->`, `${varValue}<!--{${varName}}-->`)
}

const updateReactiveVariableAttrOnChange = (element, obj, prop, value) => {
  for (let [_, attr] of Object.entries(element.attributes)) { 
    if (attr.name.startsWith('data-on') && attr.value.includes(`{${prop}}`)) {
      let finalAttribute = attr.value.replaceAll(`${obj[prop]}`, `${value}`);
      console.log(finalAttribute);
      element.setAttribute(`${attr.name}`, finalAttribute);
    }
  }
};


const addDataBindListener = (self) => {
  // add any event data-bind listener
  const elementWithDataBind = self.shadowRoot.querySelectorAll("[data-bind]");
  elementWithDataBind.forEach((element) => {
    if (element.type === "text") {
      element.addEventListener("input", (e) => {
        self.reactive[e.target.getAttribute('data-bind')] = e.target.value;
      });
    }
  });
  // add any event data-bind listener
}

const createEventListener = (self) => {
  const fnEvents = updateEventAttr(self);
  fnEvents.forEach((fn) => {
    // converted event listener
    //self.shadowRoot.querySelector(`${fn.query}`).addEventListener(`${fn.event}`, e => {
    //  console.log(eval(`self.${fn.fn}`)) // execute function 
    //})
    // onclick will only execute the latest created event?
    self.shadowRoot.querySelector(`${fn.query}`).onclick = (e) => {
      console.log(eval(`self.${fn.fn}`)) // execute function 
    };
  })
}

const updateEventAttr = (self) => {
  // replace attrs onclick -> data-onclick
  const fnEvents = [];
  const allElements = self.shadowRoot.querySelectorAll('*');

  allElements.forEach(element => {
    for (let [_, attr] of Object.entries(element.attributes)) { 
      if (attr.name.startsWith('data-on')) {
        let tmp = {
          //query: `[data-${attrName}${fnEvents.length}="${attrVal}"]`,
          query: `[${attr.name}]`,
          fn: attr.value,
          event: attr.name.split('data-on')[1]
        };
        fnEvents.push(tmp);
      }
    }
  })
  return fnEvents;
}


export default {
  noJS
}