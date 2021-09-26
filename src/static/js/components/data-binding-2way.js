import {
  makeReactive,
  makeEvent,
  toSimulate,
  NoJS
} from '../noJS.js';


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
<button (click)="alertMe(1)">Click me {lastname}?</button>
`

class Db extends HTMLElement {
  constructor() {
    super();
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      const nojs = new NoJS(this);
      this.properties = nojs.makeReactive(
        { 
          username: 'darling',
          a: 'javascript'
        }
      )
      nojs.makeEvent(
        'click',
        'button'
      )


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
