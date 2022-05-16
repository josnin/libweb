// (variable) -> variable
export const stripParenthesis = (value: string) => {
  return value[0].replace(/[()]/g, '');
};


// {variable} -> variable
export const strip = (val: string, start: string, end: string) => {
  return val.replace(start,'').replace(end,'').trim();
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
  return val.match(/\{[^{^}\n\r]*\|[^{^}\n\r]*\}/gi)
}

export const getVal = (self: any, prop: any) => {
  let res: any;
  let get: boolean = false;
  if (prop === '$event') {
    res = prop;
    get = true;
  } else if (self[prop] != undefined) { // applies to shadow var only
    res = self[prop];
    get = true;
  } else if (self.__reactive[prop] != undefined) { // applies for reactive variable
    res = self.__reactive[prop];
    get = true;
  } else if (self.getAttribute(prop)) {
    res = self.getAttribute(prop);
    get = true;
  }  else {
    res = prop;
  }
  return { res, get };
}

export const updateFnArgs = (...args: any[]) => {
  const [el, fn, args2] = args;
  const fArgs: any = [];
  args2.split(',').forEach((arg: any) => {
    // args aka prop
    const { res, get } = getVal(self, arg.trim());
    if (res) {  fArgs.push(`'${res}'`); }
  });
  const fFn = `${fn}(${fArgs.join()})`;
  return { fFn }
}

export const isFn = (val: any) => {

  //console.log(val.match(/\(.+\)/));
  return val.match(/\(/)?.length > 0;
}
