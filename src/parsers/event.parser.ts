import { getFnArgs } from "../utils.js";

export const eventParser = async (...args: HTMLElement[]) => {
  const [self, el] = args;
  for (const [_, attr] of Object.entries(el.attributes)) {

    if (attr.name.startsWith('@')) {
      el.dataset.event = attr.name.split('@')[1];
      const { fn, fnArgs } = getFnArgs(attr.value);
      el.dataset.fn = fn;
      el.dataset.args = fnArgs;
      el.dataset.js = attr.value;
      el.removeAttribute(attr.name);
    }
  }
};
