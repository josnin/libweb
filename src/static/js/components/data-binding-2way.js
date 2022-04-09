import {  
  LibW
} from '../../../libweb.js';


const template = document.createElement('template');
template.innerHTML = `
<input data-bind="username" type="text" /><span>{a} from span</span>
<div data-ba="dfsd" data-ba1="cloudy">username:{username} This is ates?{a}?? {a} {a}</div>
<button @click="alertMe({firstname}, {username})">Click me {username}?</button>
<button @click="alertMe({firstname}, 123)">Click me lastname {a}?</button>
`

class Db extends HTMLElement {

  lastname = 'now i know??';
  firstname = 'johnny 456';

  constructor() {
    super();
      const lw = new LibW(this, template);

      // create a reactive variable
      this.reactive = lw.makeReactive(
        { 
          username: 'darling',
          a: 'javascript'
        }
      )

  }


  changeValue(x) {
    console.log(x)
  }

  alertMe(last, first) {
    console.log(last, first)
    alert(`${last}  ${first}`);
    this.reactive.a = 'Hollah?';
  }
}

customElements.define('data-binding-2way', Db);
