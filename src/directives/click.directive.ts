export const clickDirective = (self: any, el: any) => {
  Array.from(el.attributes).map( (e: any) => {
      console.log(e.name)
      if (e.name.startsWith('evt')) {
        console.log(e.name.replace('evt', 'on'), self)
        el[e.name.replace('evt', 'on')] = ($event: any) => {
           eval(`self.${e.value.replaceAll('\'$event\'', '$event')}`); // execute function
        } 
      }
  })
  //const click = el.getAttribute('MyClick');
  //if (click) {
  //  el.onclick = ($event: any) => {
  //    eval(`self.${click.replaceAll('\'$event\'', '$event')}`); // execute function
  //  } 
  //}
  return el;
}