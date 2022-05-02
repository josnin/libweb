
export const attrParser = (
    self: HTMLElement,
    el: HTMLElement,
    prop: string,
    val: string
) => {
  for (const [_, attr] of Object.entries(el.attributes)) {

    if (attr.name.startsWith('@')) {
      el.dataset.event = attr.name.split('@')[1];
      el.dataset.fn = attr.value.split('(')[0];
      el.dataset.args = attr.value.split('(')[1].split(')')[0];
      el.removeAttribute(attr.name);
    }
  }
};
