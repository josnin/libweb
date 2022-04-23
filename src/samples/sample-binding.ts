import { LWElement } from '../libweb.js';

class BindingComponent extends LWElement { 

    __reactive = { username: 'darling' };
    __template = `<input data-bind="username" type="text"/>
                <div>Hello {username}</div><button __click="x($event)">Click me</button>
                <button __click="x({username})">CLick 2</button>
                `

    x(e: any) {
        console.log(e)
        alert(e);
    }
  
  }
  
  customElements.define('sample-binding', BindingComponent);