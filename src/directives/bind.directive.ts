
export  const bindDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  const bind = el.getAttribute('data-bind');
  if (el.type === "text" && bind) {
    el['oninput'] = (e: any) => {
      self.__reactive[bind] = e.target.value;
    };
  } else if (el.type === 'text' &&
    el.dataset.bind === prop) {
    // make sure to update only that match with data-binding
    el.value = val;
  }
}