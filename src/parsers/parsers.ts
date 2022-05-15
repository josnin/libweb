import { htmlParser } from './html.parser.js';
import { htmlPipeParser } from './html-pipe.parser.js';
import { eventParser } from './event.parser.js';


export class Parsers {

  args: any[];
  register = [
    htmlParser,
    htmlPipeParser,
    eventParser
  ];

  constructor(...args: any[]) {
    this.args = args;
  }

  async apply(): Promise<void> {
    const [self] = this.args;
    for (const d of this.register) {
      for (const el of self.shadowRoot.querySelectorAll('*')) {
        await d(self, el);
      }
    }
  }
}

export default {
  Parsers,
};
