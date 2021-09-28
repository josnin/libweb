import {  
  noJS, 
} from '../noJS.js';


const template = document.createElement('template');
template.innerHTML = `
<input data-bind="a" type="text" /><span>{a} from span</span>
<div data-ba="dfsd">{username} This is ates??? {username} <div>{a}</div> {a}</div>
<div data-nc="ncv" >{username} This is ates??? {lastname} {a}</div>
<button onclick="alertMe({a})">Click me {a}?</button>
`

class Db extends HTMLElement {

  lastname = 'i dont know??';

  constructor() {
    super();
      const nojs = new noJS(this, template);

      // create a reactive variable
      this.properties = nojs.makeReactive(
        { 
          username: 'darling',
          a: 'javascript'
        }
      )

  }



  alertMe() {
    this.properties.a = 'Hollah?';
  }
}

customElements.define('data-binding-2way', Db);
