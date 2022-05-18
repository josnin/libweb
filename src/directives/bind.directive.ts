
export  const bindDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;
  if (el.type === 'text' &&
    el.dataset?.bind === prop) {
    // make sure to update only that match with data-binding
    el.value = val;
  }
}