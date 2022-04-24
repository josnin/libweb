import { jsonPipe } from './json.pipe.js';

export class Pipes {

  args: any[];
  register = [jsonPipe]

  constructor(...args: any[]) {
    this.args = args;
  }

  apply() {
    const [val, name] = this.args;
    let res : any;
    if (name) {
      res = val;
      this.register.forEach(d => {
        res = d(res, name);
      })
    }
    return res;
  }

}
