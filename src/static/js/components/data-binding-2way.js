import {  noJS, makeEvent } from '../noJS.js';


const template = document.createElement('template');
template.innerHTML = `
<div>
<input data-bind="username" type="text" />
<input data-bind="a" type="text" />
</div> 
<div>{username} XYZ</div>
<div>{username} This is ates???</div>
<div>{username} This is ates??? {username}</div>

<div>{username} This is ates??? {lastname} {a}</div>
<button onclick="alertMe()">Click me {lastname}?</button>
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
    alert('i dont know??');
  }
}

customElements.define('data-binding-2way', Db);
