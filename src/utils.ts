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

// surround args multiple value with quote
export const addQuoteItems = (value: any[]) => {
  const result = value.map((r: any) => {
    return addQuote(r);
  });

  return result;
};

// extract {variable}
export const getVar = (val: any) => {
  return val.match(/{[^{^}^\|]*}/gi)!;
};

// extract { var | json }
export const getVarWPipe = (val: any) => {
  return val.match(/\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi);
};

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
  return { res, get };
};

export const updateFnArgs = (...args: any[]) => {
  const [self, el, fn, fnArgs] = args;
  const fArgs: any = [];
  let fFn;

  fnArgs.split(',').forEach((arg: any) => {
    if (arg) {
      arg = arg.trim();
      // args aka prop
      const { res, get } = getVal(self, arg);
      if (res !== '') {  fArgs.push(`${addQuote(res)}`); } // !== '' to handle 0 val?
    }
  });


  if (fArgs.length > 0 ) {
    fFn = `${fn}(${fArgs.join()})`;
  } else {
    fFn = `${fn}()`;
  }

  return { fFn };
};

export const getFnArgs = (val: any) => {
  const fn = val.split('(')[0];
  const fnArgs = val.split('(')[1].split(')')[0];

  return { fn, fnArgs };

};

export const isFn = (val: any) => {

  // console.log(val.match(/\(.+\)/));
  return val.match(/\(/)?.length > 0;
};

export const getFnVal = (...args: any[]) => {
  const [self, el, val] = args;
  const { fn, fnArgs } = getFnArgs(val);
  const { fFn } = updateFnArgs(self, el, fn, fnArgs);
  const fnVal = Function(`return this.self.${fFn}`).call({self});

  return {
    fnVal
  };

};
