
export const clickDirective = (self: any, el: any) => {
  const click = el.getAttribute('MyClick');
  if (click) {
    el.onclick = ($event: any) => {
      eval(`self.${click.replaceAll('\'$event\'', '$event')}`); // execute function
    } 
  }
  return el;
}