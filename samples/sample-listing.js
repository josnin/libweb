import { LWElement } from '../libweb.js';
class ListingComponent extends LWElement {
    constructor() {
        super(...arguments);
        this.items = [
            { name: "Elsa", age: 1 },
            { name: "Anna", age: 33 },
        ];
        this.__template = `
          <ul>
            <li *For='(idx, val) of items'>index:{idx} name: {val.name}  age:{val.age}</li>
          </ul>
        `;
    }
}
customElements.define('sample-listing', ListingComponent);
