const template = document.createElement('template');
template.innerHTML = `
<div>
<input data-bind="username" type="text" />
</div> 
<div>{username} XYZ</div>
<div>{username} This is ates???</div>
<div>{username} This is ates??? {username}</div>

<!-- what if multiple data-bind??? -->
<div data-bind="username">{username} This is ates??? {lastname}</div>
<button data-bind="username">Click me?</button>
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
        {
          username: 'darling',
          lastname: 'javascript'
        },
        this.shadowRoot
      );


      //toSimulate(
      //  this.properties,
      //  this.shadowRoot
      //)


    }

}

customElements.define('data-binding-2way', DataBinding2Way);
