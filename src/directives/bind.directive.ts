
export  const bindDirective = async (self: any, el: any, prop: string, val: string) => {
  const bind = el.getAttribute('data-bind');
  if (el.type === "text" && bind) {
    el['oninput'] = (e: any) => {
      self.__reactive[bind] = e.target.value;
    };
  }
}