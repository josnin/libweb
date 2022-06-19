import {Pipes} from './pipes/pipes.js';
import {settings} from './enums.js';

const VAR_OR_W_PIPE_REGEX = /{[^{^}^\|]*}|\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi;

// (variable) -> variable
export const stripParenthesis = (value: string) => {
  return value[0].replace(/[()]/g, '');
};


// {variable} -> variable
export const strip = (val: string, start: string, end: string) => {
  return val.replace(start, '').replace(end, '').trim();
};


export const addQuote = (val: any) => {
  if (isNaN(val) && !val.startsWith('\'')) {
    return `'${val}'`;
  } else {
    return val;
  }
};

export const runPipes = async (tmp: any, fRes: any) => {
  const fPipes: string[] = [];
  for (let pipeName of tmp.split('|').slice(1)) {
    pipeName = pipeName.trim();
    const pipes = new Pipes(fRes, pipeName);
    fRes = await pipes.apply();
    fPipes.push(pipeName);
  }

  return {fRes, fPipes};

};

export const genRef = (...args: any[]) => {
  const [el, refEl, commentVar] = args;
  const ref = Math.floor(Math.random() * 1297234);
  // @ts-ignore: dynamic index?
  globalThis[commentVar] = {
    // @ts-ignore: dynamic index?
    ...globalThis[commentVar],
    [ref] : refEl
  };
  const comment = document.createComment(`${commentVar}=${ref}`);
  el.parentNode.insertBefore(comment, el);
};

export const updateContent = (...args: any[]) => {
  // apply var replacment
  let [el, newEl] = args;
  const wComment = el.nextSibling !== Node.COMMENT_NODE;
  do {
    if (wComment) {
      el.nextSibling.textContent = newEl.textContent;
      break;
    }
   } while (el = el.nextSibling); // not comment

};

export class VarReplacer {

  args: any[];
  forObj!: { alias: any; index: any; obj: any; idx: string; v: unknown; };

  constructor(...args: any[]) {
    this.args = args;
  }

  apply = async () => {
    // replace {var}
    const [self, el, fn] = this.args;
    // extract {var} or {var | json}
    const allVars = el.textContent?.match(VAR_OR_W_PIPE_REGEX);
    let rep = false;
    if (!allVars) return {rep}; 
    for (let text of allVars) {
      text = text.trim();
      if (text) {
        const tmp = strip(text, settings.VAR_PARSE.start, settings.VAR_PARSE.end);
        const wPipe = tmp.split('|').length > 1;
        const cleanVar = tmp.split('|')[0].trim();
        rep = await fn(self, el, text, cleanVar, wPipe, tmp, this.forObj);
      }
    }
    const newEl = el;
    return {rep, newEl};

  }

}


export const getVal = (self: any, prop: any) => {
  let res: any;
  let get = false;
  if (prop === '$event') {
    res = prop;
    get = true;
  } else if (self[prop] !== undefined) { // applies to shadow var only
    res = self[prop];
    get = true;
  } else if (self.__reactive[prop] !== undefined) { // applies for reactive variable
    res = self.__reactive[prop];
    get = true;
  } else if (self.getAttribute(prop)) {
    res = self.getAttribute(prop);
    get = true;
  }  else {
    res = prop;
  }
  return {res, get};
};

export const updateFnArgs = (...args: any[]) => {
  const [self, el, fn, fnArgs] = args;
  const fArgs: any = [];
  let fFn;

  fnArgs.split(',').forEach((arg: any) => {
    if (arg) {
      arg = arg.trim();
      // args aka prop
      const {res, get} = getVal(self, arg);
      if (res !== '') {  fArgs.push(`${addQuote(res)}`); } // !== '' to handle 0 val?
    }
  });


  if (fArgs.length > 0 ) {
    fFn = `${fn}(${fArgs.join()})`;
  } else {
    fFn = `${fn}()`;
  }

  return {fFn};
};

export const getFnArgs = (val: any) => {
  const fn = val.split('(')[0];
  const fnArgs = val.split('(')[1].split(')')[0];

  return {fn, fnArgs};

};

export const isFn = (val: any) => {

  // console.log(val.match(/\(.+\)/));
  return val.match(/\(/)?.length > 0;
};

export const getFnVal = (...args: any[]) => {
  const [self, el, val] = args;
  const {fn, fnArgs} = getFnArgs(val);
  const {fFn} = updateFnArgs(self, el, fn, fnArgs);
  const fnVal = Function(`return this.self.${fFn}`).call({self});

  return {fnVal};

};
