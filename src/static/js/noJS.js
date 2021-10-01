

export class noJS {

  constructor(shadowDom, template) {
    this.self = shadowDom;
    this.self.attachShadow({mode: 'open'});
    this.self.shadowRoot.appendChild(template.content.cloneNode(true));

    // interpolate variable
    toHTML(this.self);

    createEventListener(this.self);

  }


  makeReactive = (varObj) => {
    const allElements = this.self.shadowRoot.querySelectorAll('*');
    allElements.forEach(element => {
      //addDataBindAttr(element, variable);
      updateReactiveVarHTMLOnLoad(element, varObj);
      updateReactiveVarAttrOnLoad(element, varObj);
    })

    // add data-bind listener and variable to react when there is an event
    addDataBindListener(this.self);
    //createEventListener(this.self);

    // make variable reactive
    return createReactive(this.self, varObj);

  }

}

const createReactive = (self, varObj) => {
  // react when there is a changes in value
  //const allElements = self.shadowRoot.querySelectorAll('[data-bind]');
  const allElements = self.shadowRoot.querySelectorAll("*");
  const handler = {
    get: (varObj, prop) => {
      return varObj[prop] ;
    },
    set: (varObj, prop, value) => {
      allElements.forEach((element) => {
        if (element.type == 'text') {
          element.value = value;
        } else {
          // interpolate
          // {username} > johny<!--{username}-->
          updateReactiveVarHTMLOnChange(
            element, 
            varObj, 
            prop, 
            value
          );
          //el.innerHTML = el.innerHTML.replaceAll(`${obj[prop]}<!--{${prop}}-->`, `${value}<!--{${prop}}-->`)
          updateReactiveVarAttrOnChange(
            element, 
            varObj, 
            prop, 
            value
          );

          createEventListener(self);
        }
      })
      varObj[prop] = value;
      return true; 
    }
  }

  return new Proxy(varObj, handler);
}

export const toHTML = (self) => {
  const allElements = self.shadowRoot.querySelectorAll('*');
  allElements.forEach(element => {
    updateVarHTMLOnLoad(self, element);
    updateVarAttrOnLoad(self, element);
  })
};

const updateVarAttrOnLoad = (self, element) => {
  for (let [suffixID, attr] of Object.entries(element.attributes)) { 
    let variable = attr.value.split('{')[1]?.split('}')[0];
    if (attr.name.startsWith('@') && self[variable] != undefined) {
      setAndRemoveEventAttr(
        element,
        attr.name,
        attr.value,
        suffixID,
        variable,
        self[variable]
      )

    }
  }
};

const updateVarHTMLOnLoad = (self, element) => {
  // replace with real value {username} > johnny, applies on non-reactive variable
  element.textContent.split(' ').forEach(text => {
    if (text.startsWith('{') && text.endsWith('}')) {
      let variable = text.split('{')[1].split('}')[0];
      if (self[variable] != undefined) {
        element.innerHTML = element.innerHTML.replaceAll(
          text, 
          self[variable]
        )
      }
    }
  })
}

const updateReactiveVarHTMLOnLoad = (element, reactiveObj) => {
  // replace with real value {username} > johnny, applies on reactive variable
  for (let [varName, varValue] of Object.entries(reactiveObj)) {
    // {username} > johnny<!--{username}-->
    element.innerHTML = element.innerHTML.replaceAll(
      `{${varName}}`, 
      `${varValue}<!--{${varName}}-->`
    )
  };
};

const setAndRemoveEventAttr = (
  element, 
  attrName, 
  attrVal,
  suffixID, 
  varName,
  varValue
) => {

  let finalAttribute = attrVal.replaceAll(
    `{${varName}}`, 
    `'${varValue}'`
  );

  // data-click1 suffix counter to make use its unique event
  element.setAttribute(
    `data-${attrName.replace('@', 'on')}${suffixID}`,  
    `${finalAttribute};/* {${varName}} */`
  );

  // remove @click attributes
  element.removeAttribute(`${attrName}`);
};

const updateReactiveVarAttrOnLoad = (element, reactiveObj) => {
  for (let [suffixID, attr] of Object.entries(element.attributes)) { 
    for (let [varName, varValue] of Object.entries(reactiveObj)) {
      // only applies for event attr
      if (attr.name.startsWith('@')) {  // @Todo use enum to define this
        setAndRemoveEventAttr(
          element,
          attr.name,
          attr.value,
          suffixID,
          varName,
          varValue
        )
      }
      // only applies for event attr
    }
  }
};

const updateReactiveVarHTMLOnChange = (
  element, 
  reactiveObj, 
  varName, 
  varValue
) => {
  element.innerHTML = element.innerHTML.replaceAll(
    `${reactiveObj[varName]}<!--{${varName}}-->`, 
    `${varValue}<!--{${varName}}-->`
  );
}

const updateReactiveVarAttrOnChange = (
  element, 
  obj, 
  prop, 
  value
) => {
  for (let [_, attr] of Object.entries(element.attributes)) { 
    if (attr.name.startsWith('data-on') && 
        attr.value.includes(`{${prop}}`)
    ) {
      let finalAttribute = attr.value.replaceAll(
        `${obj[prop]}`, 
        `${value}`
      );
      console.log(finalAttribute);
      element.setAttribute(
        `${attr.name}`, 
        finalAttribute
      );
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

const executeFunction = (self, fn) => {
  console.log(eval(`self.${fn.fn}`)) // execute function 
}

const createEventListener = (self) => {
  const fnEvents = getEventsAttrFn(self);
  fnEvents.forEach((fn) => {
    // converted event listener
    console.log(fn.query, fn.event);
    //self.shadowRoot.querySelector(`${fn.query}`).removeEventListener(`${fn.event}`, executeFunction(self, fn))
    //self.shadowRoot.querySelector(`${fn.query}`).addEventListener(`${fn.event}`, e => {
    //  console.log(eval(`self.${fn.fn}`)) // execute function 
    //}, true)
    // onclick will only execute the latest created event?
    self.shadowRoot.querySelector(`${fn.query}`).onclick = (e) => {
      console.log(eval(`self.${fn.fn}`)) // execute function 
    };
  })
}

const getEventsAttrFn = (self) => {
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