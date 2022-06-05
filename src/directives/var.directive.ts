import { Pipes } from '../pipes/pipes.js';

export const varDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;

  if (el.dataset?.var && el.dataset.var === prop) {
    let fVal = val;

    if (el.dataset.pipe) {
      for (const pipeName of el.dataset.pipe.split('|')) {
        const pipes = new Pipes(fVal, pipeName);
        fVal = await pipes.apply();
      }
    }

    el.textContent =  fVal;
  }

};
