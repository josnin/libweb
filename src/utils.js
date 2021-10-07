// (variable) -> variable
export const stripParenthesis = (value) => {
  return value[0].replace(/[()]/g, ''); 
};


// {variable} -> variable
export const strip = (value, start, end) => {
  return value.split(start)[1].split(end)[0];
};


export const addQuote = (val) => {
  if (isNaN(val)) {
    return `'${val}'`;
  } else {
    return val;
  }
}

// surround args multiple value with quote
export const addQuoteItems = (value) => {
  const result = value.map(r => {
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