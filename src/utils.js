
export const stripParenthesis = (value) => {
  return value[0].replace(/[()]/g, ''); 
};

export const getFunctionArgs = (value) => {
  return value.match(/\(.+\)/g);
};


export default {
  stripParenthesis,
  getFunctionArgs
}