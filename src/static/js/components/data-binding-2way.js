import {  
  noJS, 
} from '../noJS.js';


const template = document.createElement('template');
template.innerHTML = `
<input data-bind="a" type="text" />
<div>{username} This is ates??? {username} {a}</div>
<div>{username} This is ates??? {lastname} {a}</div>
<button onclick="alertMe()">Click me {a}?</button>
`

class Db extends HTMLElement {
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
