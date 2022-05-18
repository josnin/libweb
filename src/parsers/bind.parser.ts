
export  const bindParser = async (...args: any[]) => {
  const [self, el] = args;
  const bind = el.getAttribute('(model)'); // 2 way binding should we use model?
  if (el.type === "text" && bind) {
    el['oninput'] = (e: any) => {
      self.__reactive[bind] = e.target.value;
    };
    el.value = self.__reactive[bind];
    el.removeAttribute('(model)');
    el.dataset.bind = bind;
  }
}