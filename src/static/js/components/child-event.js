// example how to pass data to parent element
class ChildEvent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'})
    }

    connectedCallback() {
      this.render();
      this.triggerParentEvent();
    }
    
    triggerParentEvent() {
      this.shadowRoot.addEventListener('click', e => {
        const event = new CustomEvent(
          'build', 
          { 
            detail: `trigger from child ${this.getAttribute('size')}`, 
            bubbles: true 
          }
        );
        this.dispatchEvent(event); // outside shadow DOM
      })
    }

    render() {
      this.shadowRoot.innerHTML = `
        <h1>Child Event</h1>
        size is ${this.getAttribute('size')}
        `;
    }

}

customElements.define('child-event', ChildEvent);