import {  NoJS } from '../noJS.js';


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
<button onclick="alertMe(1)">Click me {lastname}?</button>
<button onclick="alertMe(2)">Click me {lastname}?</button>
`

class Db extends HTMLElement {
  constructor() {
    super();
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      const nojs = new NoJS(this);

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

  alertMe(x) {
    alert(x)
  }
}

customElements.define('data-binding-2way', Db);
