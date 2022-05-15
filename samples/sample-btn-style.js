import { LWElement } from "./libweb.js";
class ButtonStyle extends LWElement {
    constructor() {
        super(...arguments);
        this.__template = `
        <button type="submit">Click me</button>
  `;
        this.__styles = `
    button {
      background-color: #f4511e;
      border: none;
      color: white;
      padding: 16px 32px;
      text-align: center;
      font-size: 16px;
      margin: 4px 2px;
      opacity: 0.6;
      transition: 0.3s;
    }
  
    button:hover {opacity: 1}
    
  `;
    }
}
customElements.define('button-style', ButtonStyle);
