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



export default {
  stripParenthesis,
  strip,
  addQuote,
  addQuoteItems,
  getVar,
  getVarWPipe
};
