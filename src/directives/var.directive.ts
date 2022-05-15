import { Pipes } from '../pipes/pipes.js';

export const varDirective = async (...args: any[]) => {
  const [self, el, prop, val] = args;

  if (el.dataset.var !== undefined && el.dataset.var === prop) {
    let fVal = val;

    if (el.dataset.pipe) {
      const pipeName = el.dataset.pipe;
      const pipes = new Pipes(fVal, pipeName);
      fVal = await pipes.apply();
    }

    el.textContent =  fVal; 
  }

};