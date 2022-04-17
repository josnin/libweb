
export const bindDirective = (self: any, el: any) => {
  const bind = el.getAttribute('data-bind');
  if (el.type === "text" && bind) {
    el.addEventListener("input", (e: any) => {
      self.__reactive[bind] = e.target.value;
    });
  }
  return el; // req. to return
}