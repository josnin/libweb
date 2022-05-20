
export const titlePipe = async(...args: string[]) => {
  const [val, name] = args;
  if (name === 'title') {
    return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
  }
  return val;
}