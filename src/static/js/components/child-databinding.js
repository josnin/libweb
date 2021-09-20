
class ChildDataBinding extends HTMLInputElement {
    constructor() {
      super();
      this.addEventListener('input', e => {
        const event = new CustomEvent(
          'change1', 
          { 
            detail: this.value, 
            bubbles: true 
          }
        );
        this.dispatchEvent(event); // outside shadow DOM
        console.log('constructor', this.value, this.getAttribute('value'))
      })
    }

}

customElements.define('child-databinding', ChildDataBinding, { extends: 'input'});