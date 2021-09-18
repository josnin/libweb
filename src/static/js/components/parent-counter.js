const config = { attributes: true, childList: true, subtree: true };

class ParentCounter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <div>Parent counter</div>
    <my-counter count="10">This is a test??? </my-counter>
    `

  };

 callback(changelist, observer) {
    console.log(this.shadowRoot.querySelector('my-counter').count);
    console.log(changelist)
}

  connectedCallback() {
    const observer = new MutationObserver(
      this.callback.bind(this)
    );

    observer.observe(
      this.shadowRoot.querySelector('my-counter'),
      config
    )
  }
  


}

customElements.define('parent-counter', ParentCounter)