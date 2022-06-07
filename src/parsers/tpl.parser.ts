
export const tplParser = async (...args: any[]) => {
  const [self, el] = args;
  const If = el.getAttribute('*if');
  if (If) {
    const fragment = new DocumentFragment;
    const clonedNode = el.cloneNode(true) //document.createElement('div');
    fragment.appendChild(clonedNode); 
      el.innerHTML = `${el.innerHTML} <template>${clonedNode}</template>`
  }
};
