
export const createReactive = (
  self, 
  varObj, 
  events,
  template1,
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
        if (element.type == 'text' && 
        element.dataset.bind == prop) {
          // make sure to update only that match with data-binding
          element.value = value;
        } else {
          // {username} > johny<!--{username}-->
          templates.updateVarHTMLOnChange(
            element, 
            varObj, 
            prop, 
            value
          );

          templates.updateVarAttrOnChange(
            element, 
            prop, 
            value
          );

          events.createEventListener(self);
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