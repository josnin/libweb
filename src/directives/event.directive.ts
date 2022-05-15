import { getVal } from '../utils.js';

export const eventDirective = async (self: any, el: any) => {

  if (el.dataset.event) {
    el[`on${el.dataset.event}`] = async ($event: any) => {
      try {
        // exec normal func
        const fArgs: any = [];
        await el.dataset.args.split(',').forEach((arg: any) => {
          // args aka prop
          const res = getVal(self, arg.trim());
          if (res) {
            fArgs.push(`'${res}'`);
          }
        });
        const fFn = `${el.dataset.fn}(${fArgs.join()})`;
        Function(`this.self.${fFn.replaceAll('\'$event\'', 'this.$event')}`).call({self, $event});
      } catch {
        // exec direct js, i.e alert(1)
        Function(`${el.dataset.js.replaceAll('\'$event\'', 'this.$event')}`).call({$event});
      }

    };
  }

};
