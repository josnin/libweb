import { Pipes } from '../pipes/pipes.js';

export const htmlVarReactive = async (
  self: any,
  el: HTMLElement,
  prop: string,
  val: string
) => {

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