export const jsonPipe = async(val: string, name: string) => {
  if (name === 'json') {
      return JSON.stringify(val);
  }
  return val;
}