const template = document.createElement('template');
template.innerHTML = `
  <style>
  p { font-size: 34px; }
  </style>
  <p>My paragraph</p>
  <input data-model="myresult2" />
  <input data-model="myresult" />
  <span>{{myresult}} a</span>
  <span>{{myresult}} b</span>
  <div>This is the result {{myresult}} of 3rd span</div>
  <div>{{myresult2}}</div>
`

class DataBinding extends HTMLElement {
    myresult = 'test1';
    myresult2 = 'This is a test';

    constructor() {
      super();
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.addBinding('myresult'); //@Todo
      this.addBinding('myresult2');

    }


    addDataBindAttr(refName) {
      // add data-bind attr to those with requires interpolation {{variables}}
      const elements = ['div', 'span'];
      elements.forEach(el1 => {
        this.shadowRoot.querySelectorAll(el1).forEach(el => {
          if (el.textContent.includes(refName)) {
            el.setAttribute('data-bind', refName);
          }
        })
      })
    }
    

    replaceVariableInitial(refName, refData) {
      // initial replace {{variable}} with real value
      this.shadowRoot.querySelectorAll(`[data-bind="${refName}"]`).forEach(el => {
        console.log(`[data-bind="${refName}"]`,  refData, refName);
        el.innerHTML = el.innerHTML.replaceAll(`{{${refName}}}`, `${refData}<!--{{${refName}}}-->`)
        console.log(el.innerHTML)
      })
    }

    replaceVariableOnEvent(refName, oldVal, newVal) {
      // when event happen replace {{variable}} with real value
      this.shadowRoot.querySelectorAll(`[data-bind="${refName}"]`).forEach(el => {
        el.innerHTML = el.innerHTML.replaceAll(`${oldVal}<!--{{${refName}}}-->`, `${newVal}<!--{{${refName}}}-->`)
      })
    }

    addBinding(refName) {
      // use to make the variable reactive
      let refData = this[refName];
      this.addDataBindAttr(refName);
      this.replaceVariableInitial(refName, refData);

      this.shadowRoot.querySelector(`[data-model="${refName}"]`).addEventListener('input', e => {
        this.replaceVariableOnEvent(
          refName,
          refData,
          e.target.value
        )
        refData = e.target.value;
      })
    }
    

}

customElements.define('data-binding', DataBinding);
