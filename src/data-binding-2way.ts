import {  
  LWElement
} from './libweb.js';

class SampleEl extends LWElement {

  lastname: string = 'now i know??';
  firstname: string = 'johnny 456';

  // create a reactive variable
  reactive = { 
    username: 'darling',
    a: 'javascript',
    b: 'dd'
  }

  template = `
    <input data-bind="username" type="text" />
    <div data-ba="dfsd" data-ba1="cloudy">{abc} {myattr} {a} language {a}</div>
    <button @click="alertMe({firstname}, {username})">Click me {username}? {myattr}</button>
    `

  alertMe2(aa: any, bb: any) {
    this.reactive.a = aa;
    alert(bb)
  }

}

customElements.define('data-binding-2way', SampleEl);
