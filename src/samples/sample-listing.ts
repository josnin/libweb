
import { LWElement } from '../libweb.js';

class ListingComponent extends LWElement { 
  items: any = [
    { name: "Elsa", age: 1},
    { name : "Anna", age: 33},
  ]
  __template: any = `<ul><li *For='(idx, val) of items'>index:{idx} name: {val.name}  age:{val.age}</li>`;
}
  
customElements.define('sample-listing', ListingComponent);