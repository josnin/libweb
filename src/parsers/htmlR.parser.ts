
export const htmlReactive = (
  self: any,
  element: HTMLElement,
  varName: string,
  varValue: string
) => {
  element.innerHTML = element.innerHTML.replaceAll(
    `${self.__reactive[varName]}<!--${varName}-->`,
    `${varValue}<!--${varName}-->`
  );
  return element;
};