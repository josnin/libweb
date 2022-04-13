import {  
  LibWeb
} from './libweb.js';


const template = document.createElement('template');
template.innerHTML = `
<input data-bind="username" type="text" />
<div data-ba="dfsd" data-ba1="cloudy">{abc} {myattr} {a} language {a}</div>
<button @click="alertMe({firstname}, {username})">Click me {username}? {myattr}</button>
`

class Db extends HTMLElement {

  lastname: string = 'now i know??';
  firstname: string = 'johnny 456';
  reactive: any;

  constructor() {
    super();
      const lw = new LibWeb(this, template);

      // create a reactive variable
      this.reactive = lw.makeReactive(
        { 
          username: 'darling',
          a: 'javascript',
          b: 'dd'
        }
      )

  }


  changeValue(x: string) {
    console.log(x)
  }

  alertMe(last: string, first: string) {
    console.log(last, first)
    alert(`${last}  ${first}`);
    this.reactive.a = 'Hollah?';
  }
}

customElements.define('data-binding-2way', Db);
