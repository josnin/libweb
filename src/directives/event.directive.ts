import { getVal } from '../utils.js';

export const eventDirective = (self: any, el: any) => {

  if (el.dataset.event) {
    el[`on${el.dataset.event}`] = ($event: any) => {
      try {
        // exec normal func
        const fArgs: any = [];
        el.dataset.args.split(',').forEach((arg: any) => {
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
        Function(`${el.value.replaceAll('\'$event\'', 'this.$event')}`).call({$event});
      }

    };
  }

};
