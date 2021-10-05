// (variable) -> variable
export const stripParenthesis = (value) => {
  return value[0].replace(/[()]/g, ''); 
};

// extrac (variable1, variable2)
export const getFunctionArgs = (value) => {
  return value.match(/\(.+\)/g);
};

// extract {variable}
export const getHTMLVar = (value) => {
  return value.match(/\{.+\}/g);
};

// {variable} -> variable
export const stripBraces = (value) => {
  return value.split('{')[1].split('}')[0];
};

export const updateEventFunctionArgs = (self, attrName, attrVal, reactiveObj) => {
  if (attrName.startsWith('@') || attrName.startsWith('data-on')) {
    const functionArgs = stripParenthesis(
      getFunctionArgs(attrVal)
    );
    const finalArgs = [];
    const commentArgs = [];
    let argsUpdateOk = true;
    functionArgs.split(',').forEach(e => {
      let arg = e.trim();
      console.log(self[arg], arg, reactiveObj)
      if (self[arg] != undefined) {
        finalArgs.push(self[arg]);
        commentArgs.push(arg);
      } else if(reactiveObj[arg] != undefined) {
        finalArgs.push(reactiveObj[arg]);
        commentArgs.push(arg);
      } else {
        console.warn(`This function "${attrVal}" unable to update args ${arg}`);
        argsUpdateOk = false;
        return
      }
    })

    if (argsUpdateOk) {
      let tmp = finalArgs.map(r => `'${r}'`).join(','); //@Todo how about numeric??
      tmp = `(${tmp})/*${commentArgs.join(',')}*/`;
      const result = attrVal.replaceAll(/\((.+)\)/g, `${tmp}`);
      return result;
    }
  }
};



export default {
  stripParenthesis,
  stripBraces,
  getFunctionArgs,
  updateEventFunctionArgs,
  getHTMLVar
}