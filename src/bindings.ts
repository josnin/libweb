
export const addDataBindListener = (self: any) => {
  // add any event data-bind listener
  const elementWithDataBind = self.shadowRoot.querySelectorAll("[data-bind]");
  elementWithDataBind.forEach((element: any) => {
    if (element.type === "text") {
      element.addEventListener("input", (e: any) => {
        self.reactive[e.target.getAttribute('data-bind')] = e.target.value;
      });
    }
  });
  // add any event data-bind listener
}

export default {
  addDataBindListener
}