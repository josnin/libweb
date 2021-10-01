import {  
  noJS, 
} from '../noJS.js';


const template = document.createElement('template');
template.innerHTML = `
<input data-bind="a" type="text" /><span>{a} from span</span>
<div data-ba="dfsd" data-ba1="cloudy">{username} This is ates??? {username} <div>{a}</div> {a}</div>
<div data-nc="ncv" >{username} This is ates??? {lastname} {a}</div>
<button id="btn" @click="alertMe({a})">Click me {a}?</button>
`

class Db extends HTMLElement {

  lastname = 'now i know??';

  constructor() {
    super();
      const nojs = new noJS(this, template);

      // create a reactive variable
      this.reactive = nojs.makeReactive(
        { 
          username: 'darling',
          a: 'javascript'
        }
      )

  }



  alertMe(x) {
    alert(x);
    //this.reactive.a = 'Hollah?';
  }
}

customElements.define('data-binding-2way', Db);
