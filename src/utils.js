// (variable) -> variable
export const stripParenthesis = (value) => {
  return value[0].replace(/[()]/g, ''); 
};

// extrac (variable1, variable2)
export const getFunctionArgs = (value) => {
  return value.match(/\(.+\)/g);
};

// extract {variable}
export const getVar = (value) => {
  return value.match(/\{.+\}/g);
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

export const updateEventFunctionArgs = (self, attrName, attrVal, reactiveObj) => {
  if (attrName.startsWith('@')) {
    const functionArgs = strip(
      getFunctionArgs(attrVal)[0],
      '(', ')'
    );
    const finalArgs = [];
    const commentArgs = [];
    let argsUpdateOk = true;
    functionArgs.split(',').forEach(e => {
      let arg = '';
      let cleanArg = '';
      if (getVar(e) != undefined) {
        arg = getVar(e)[0];
        cleanArg = strip(arg, '{', '}');
      } else {
        arg = e.trim()
        cleanArg = e.trim();
      }

      //console.log(self[arg], arg, reactiveObj)
      if(parseInt(cleanArg)) {
        console.warn(`numeric args ${cleanArg} not req. to parse in function ${attrVal}`);
        finalArgs.push(parseInt(cleanArg));
        commentArgs.push(parseInt(arg));
      } else if (cleanArg.startsWith("'")) {
        // skip string args & numeric
        console.warn(`string args ${cleanArg} not req. to parse in function ${attrVal}`);
        finalArgs.push(cleanArg); // if string remove "'1234'"
        commentArgs.push(arg);
        //console.log(arg);
      } else if (self[cleanArg] != undefined) {
        finalArgs.push(self[cleanArg]);
        commentArgs.push(arg);
      } else if(reactiveObj[cleanArg] != undefined) {
        finalArgs.push(reactiveObj[cleanArg]);
        commentArgs.push(arg);
      } else if(self[cleanArg] == undefined || reactiveObj[cleanArg] == undefined) {
        console.warn(`args ${cleanArg} unable to parse in function ${attrVal}`);
        argsUpdateOk = false;
        return
      }

    })

    if (argsUpdateOk) {
      let tmp = addQuote(finalArgs);
      tmp = `(${tmp})/*${commentArgs.join(',')}*/`;
      const result = attrVal.replaceAll(/\((.+)\)/g, `${tmp}`);
      return result;
    }
  }
};

export const getArgLocation = (attrVal, prop) => {
  // get Args location
  let result = undefined;
  const commentArgs = strip(attrVal, '/*', '*/');
  commentArgs.split(',').forEach( (val, index) => {
    if (prop == strip(val, '{', '}')) {
      result = index;
    }
  })
  return result;
  // get Args location
}

export const getOldArgs = (attrVal) => {
  const result = strip(
    getFunctionArgs(attrVal)[0],
    '(', ')'
  );
  return result;
}

export const getNewArgs = (oldArgs, argLocation, newVal) => {
  // get Value to update
  let result = [];
  oldArgs.split(',').forEach((val, index) => {
    if (index == argLocation) {
      result.push(newVal); // new value @Todo missing quote 
    } else {
      result.push(val);
    }
  })

  return result;
  // get Value to update

}



export default {
  stripParenthesis,
  strip,
  getFunctionArgs,
  updateEventFunctionArgs,
  getVar,
  getArgLocation,
  getOldArgs,
  getNewArgs
}