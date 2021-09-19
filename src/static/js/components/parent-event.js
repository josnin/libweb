// example how to recv data from child element?
class ParentEvent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'})
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <h1>Parent Event</h1>
      <child-event size="12"></child-event>
      <parent-counter></parent-counter>
    `;
    this.shadowRoot.addEventListener('build', e => {
        console.log(e.detail);
    })
  }
}

customElements.define('parent-event', ParentEvent);