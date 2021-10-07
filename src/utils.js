// (variable) -> variable
export const stripParenthesis = (value) => {
  return value[0].replace(/[()]/g, ''); 
};


// {variable} -> variable
export const strip = (value, start, end) => {
  return value.split(start)[1].split(end)[0];
};


// surround args value with quote
export const addQuote = (value) => {
  const result = value.map(r => {

    if (!parseInt(r) && r.startsWith("'")) {
      return r;
    }

    if (!parseInt(r)) {
      return `'${r}'`; // add quote
    }
    return r;
  });

  return result;
};




export default {
  stripParenthesis,
  strip,
  addQuote
}