
export const addDataBindListener = (self) => {
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

export default {
  addDataBindListener
}