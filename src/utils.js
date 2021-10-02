
export const stripParenthesis = (value) => {
  return value[0].replace(/[()]/g, ''); 
};

export const getFunctionArgs = (value) => {
  return value.match(/\(.+\)/g);
};

export const updateEventFunctionArgs = (self, attrName, attrVal) => {
  if (attrName.startsWith('@')) {
    console.log(attrVal)
    console.log(getFunctionArgs(attrVal));
    const functionArgs = stripParenthesis(
      getFunctionArgs(attrVal)
    );
    const finalArgs = [];
    const commentArgs = [];
    functionArgs.split(',').forEach(e => {
      let arg = e.trim();
      if (self[arg] != undefined) {
        finalArgs.push(self[arg]);
        commentArgs.push(arg);
      } else {
        console.warn(`This function "${attrVal}" unable to update args`);
        return
      }
    })
    let tmp = finalArgs.map(r => `'${r}'`).join(','); //@Todo how about numeric??
    tmp = `(${tmp})/*${commentArgs.join(',')}*/`;
    const result = attrVal.replaceAll(/\((.+)\)/g, `${tmp}`);
    console.log(result, attrVal)
    return result
  }
};



export default {
  stripParenthesis,
  getFunctionArgs,
  updateEventFunctionArgs
}