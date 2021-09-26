import {  
  noJS, 
  toSimulate
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
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      const nojs = new noJS(this);

      // create a reactive variable
      this.properties = nojs.makeReactive(
        { 
          username: 'darling',
          a: 'javascript'
        }
      )

      // create an event listeners 
      nojs.makeEvent();


      //toSimulate(
      //  this,
      //  this.properties,
      //);
  }



  alertMe() {
    this.properties.a = 'Hollah?';
  }
}

customElements.define('data-binding-2way', Db);
