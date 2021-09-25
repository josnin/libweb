const template = document.createElement('template');
template.innerHTML = `
<div>
<input data-bind="username" type="text" />
</div> 
<div data-bind="username">{username} This is ates???</div>
<div data-bind="username">{username} This is ates???</div>
<div data-bind="username">{username} This is ates??? {username}</div>

<!-- what if multiple data-bind??? -->
<div data-bind="username">{username} This is ates??? {lastname}</div>
<button data-bind="username">Click me?</button>
`

import {
  makeReactive,
  toHTML,
  toSimulate
} from '../toJS.js';

class DataBinding2Way extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      let el1 = this.shadowRoot.querySelectorAll("[data-bind]");

      this.properties = makeReactive(
        { username: 'darling',
          lastname: 'javasript',  },
        el1,
      );

      toHTML(
        this.properties,
        el1 
      )

      toSimulate(
        this.properties,
        el1
      )


    }

}

customElements.define('data-binding-2way', DataBinding2Way);
