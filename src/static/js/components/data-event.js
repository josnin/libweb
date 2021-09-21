const template = document.createElement('template');
template.innerHTML = `
  <h1>Click Event sample</h1>
  <button (click)="alertMe('nice aler??')">Click Me?</button>
  <button (click)="alert2()">Click Me2?</button>
  <input (input)="alertMe('new input??')"/>
`

class DataEvent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.createEventListener('click', 'button')
      this.createEventListener('input', 'input')

    }

    createEventListener(evt, el1) {
      const funcWithEvents = this.replaceEventAttr(evt, el1);
      funcWithEvents.forEach((f, ctr) => {
        // data-${evt}${ctr}="${f}" >>> data-click0="alertMe()"

        // converted event listener
        this.shadowRoot.querySelector(`[data-${evt}${ctr}="${f}"]`).addEventListener(`${evt}`, e => {
          console.log(eval(`this.${f}`)) // execute function 
        })

      })
    }

    replaceEventAttr(evt, el1) {
      // replace attrs (click) -> data-click0
      // (input) -> data-input0

      const funcWithEvents = [];
      this.shadowRoot.querySelectorAll(`${el1}`).forEach(el => {
        if (el.attributes[0].name.includes(`${evt}`)) {
          const tempAttr = el.getAttribute(`(${evt})`);

          // create final event attr
          el.setAttribute(
            `data-${evt}${funcWithEvents.length}`, tempAttr
          )
          
          // get all the functions to execute in event listener
          if (el.getAttribute(`(${evt})`)) {
            funcWithEvents.push(el.getAttribute(`(${evt})`))
          }

          // remove once attributes has been replaced
          el.removeAttribute(`(${evt})`)
        }
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

customElements.define('data-event', DataEvent);
