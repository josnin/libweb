
import { LWElement } from '../libweb.js';

class ListingComponent extends LWElement { 
  items: any = [
    { name: "Elsa", age: 1},
    { name : "Anna", age: 33},
  ]
  __template: any = `<ul><li *For='i in items'>name: {i.name}  age:{i.age}</li>`;
}
  
customElements.define('sample-listing', ListingComponent);