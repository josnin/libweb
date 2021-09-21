const template = document.createElement('template');
template.innerHTML = `
  <h1>Click Event sample</h1>
  <button (click)="alertMe('nice aler??')">Click Me?</button>
  <button (click)="alert2()">Click Me2?</button>
`

class DataClick extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.createEventListener('click')

    }

    createEventListener(evt) {
      const funcWithEvents = this.replaceEventAttr(evt);
      funcWithEvents.forEach((f, ctr) => {
        console.log(`[data-${evt}${ctr}="${f}"]`)
        this.shadowRoot.querySelector(`[data-${evt}${ctr}="${f}"]`).addEventListener('click', e => {
          console.log(eval(`this.${f}`))
        })
      })
    }

    replaceEventAttr(evt) {
      const funcWithEvents = [];
      this.shadowRoot.querySelectorAll('button').forEach(el => {
        console.log(el.attributes)
        const tempAttr = el.getAttribute(`(${evt})`);
        el.setAttribute(`data-${evt}${funcWithEvents.length}`, tempAttr)
        funcWithEvents.push(el.getAttribute(`(${evt})`))
        el.removeAttribute(`(${evt})`)
      })
      return funcWithEvents
    }

    alertMe(x) {
      alert(x)
    }

    alert2() {
      alert('second alert');
    }

}

customElements.define('data-click', DataClick);
