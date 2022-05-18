import { 
  htmlParser,
  htmlPipeParser,
  eventParser,
  attrParser,
  bindParser
} from '../parsers/index.js';

export class Parsers {

  args: any[];
  register = [
    htmlParser,
    htmlPipeParser,
    eventParser,
    attrParser,
    bindParser
  ];

  constructor(...args: any[]) {
    this.args = args;
  }

  async apply(): Promise<void> {
    const [self, fragment] = this.args;
    for (const d of this.register) {
      for (const el of fragment.querySelectorAll('*')) {
        await d(self, el);
      }
    }
  }
}

export default {
  Parsers,
};
