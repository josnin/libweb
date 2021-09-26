const template = document.createElement('template');
template.innerHTML = `
<div>
<input data-bind="username" type="text" />
<input data-bind="lastname" type="text" />
</div> 
<div>{username} XYZ</div>
<div>{username} This is ates???</div>
<div>{username} This is ates??? {username}</div>

<div>{username} This is ates??? {lastname}</div>
<button>Click me {lastname}?</button>
`

import {
  makeReactive,
  toSimulate,
} from '../toJS.js';



class DataBinding2Way extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.properties = makeReactive(
        // need to know the shadow DOM
        this.shadowRoot, 

        // declare reactive variables here
        { 
          username: 'darling',
          lastname: 'javascript'
        }

      );


      toSimulate(
        this.properties,
        this.shadowRoot
      )


    }



}

customElements.define('data-binding-2way', DataBinding2Way);
