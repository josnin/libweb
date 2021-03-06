import {updateFnArgs, getFnArgs} from '../common.js';

export const eventDirective = async (...args: any[]) => {
  const [self, el] = args;
  if (el.dataset?.event) {
    el[`on${el.dataset.event}`] = async ($event: any) => {
      try {
        // exec normal func
        const {fn, fnArgs} = getFnArgs(el.dataset.js);
        const {fFn} = updateFnArgs(self, el, fn, fnArgs);
        Function(`this.self.${fFn.replaceAll('\'$event\'', 'this.$event')}`).call({self, $event});
      } catch {
        // exec direct js, i.e alert(1)
        Function(`${el.dataset.js.replaceAll('$event', 'this.$event')}`).call({$event});
      }

    };
  }

};
