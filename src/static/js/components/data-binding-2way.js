import {  
  noJS, 
} from '../../../noJS.js';


const template = document.createElement('template');
template.innerHTML = `
<input data-bind="a" type="text" /><span>{a} from span</span>
<div data-ba="dfsd" data-ba1="cloudy">username->{username} This is ates??? a->{a} {a}</div>
<div data-ba="dfsd" data-ba1="cloudy">username->{username} This is ates??? a->{a} {a}</div>
<div data-ba="dfsd" data-ba1="cloudy">username->{username} This is ates??? a->{a} {a}</div>
<div data-ba="dfsd" data-ba1="cloudy">username->{username} This is ates??? a->{a} {a}</div>
<button @click="alertMe(firstname, lastname)">Click me {a}?</button>
`

class Db extends HTMLElement {

  lastname = 'now i know??';
  firstname = 'johnny';

  constructor() {
    super();
      const nojs = new noJS(this, template);

      // create a reactive variable
      this.reactive = nojs.makeReactive(
        { 
          username: 'darling',
          a: 'javascript'
        }
      )

  }


  changeValue(x) {
    console.log(x)
  }

  alertMe(last, first) {
    console.log(last, first)
    alert(`${last}  ${first}`);
    this.reactive.a = 'Hollah?';
  }
}

customElements.define('data-binding-2way', Db);
