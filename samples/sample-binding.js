import { LWElement } from "./libweb.js";
class Binding extends LWElement {
    constructor() {
        super(...arguments);
        this.__reactive = { username: 'darling' };
        this.__template = `<input (model)="username" type="text"/> {username}`;
    }
}
customElements.define('sample-binding', Binding);
