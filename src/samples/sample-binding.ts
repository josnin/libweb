import { LWElement } from './libweb.js';

class BindingComponent extends LWElement { 

    __reactive = { username: 'darling' };
    __template = `<input data-bind="username" type="text" />
                <div>Hello {username}</div>`
  
  }
  
  customElements.define('sample-binding', BindingComponent);