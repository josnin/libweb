import { LWElement } from '../libweb.js';
class BindingComponent extends LWElement {
    constructor() {
        super(...arguments);
        this.__reactive = { username: 'darling' };
        this.__template = `<input data-bind="username" type="text"/> {username}`;
    }
}
customElements.define('sample-binding', BindingComponent);
