// (variable) -> variable
export const stripParenthesis = (value: string) => {
  return value[0].replace(/[()]/g, ''); 
};


// {variable} -> variable
export const strip = (value: string, start: string, end: string) => {
  return value.split(start)[1].split(end)[0];
};


export const addQuote = (val: any) => {
  if (isNaN(val)) {
    return `'${val}'`;
  } else {
    return val;
  }
}

// surround args multiple value with quote
export const addQuoteItems = (value: string[]) => {
  const result = value.map((r: string) => {
    return addQuote(r);
  });

  return result;
};




export default {
  stripParenthesis,
  strip,
  addQuote,
  addQuoteItems
}