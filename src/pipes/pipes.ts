import { titlePipe, jsonPipe } from '../pipes/index.js';

export class Pipes {

  args: any[];
  register = [
    jsonPipe,
    titlePipe
  ];

  constructor(...args: any[]) {
    this.args = args;
  }

  async apply() {
    const [val, name] = this.args;
    let res: any;
    if (name) {
      res = val;
      for (const d of this.register) {
        res = await d(res, name);
      }
    }
    return res;
  }

}
