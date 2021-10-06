
export const createReactive = (
  self, 
  varObj, 
  createEventListener,
  updateVarHTMLOnChange,
  updateVarAttrOnChange
) => {
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
          updateVarHTMLOnChange(
            element, 
            varObj, 
            prop, 
            value
          );
          //el.innerHTML = el.innerHTML.replaceAll(`${obj[prop]}<!--{${prop}}-->`, `${value}<!--{${prop}}-->`)
          updateVarAttrOnChange(
            element, 
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


export default {
  createReactive,
}