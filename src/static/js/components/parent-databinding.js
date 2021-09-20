const template = document.createElement('template');
template.innerHTML = `
  <style>
  p { font-size: 34px; }
  </style>
  <p>My paragraph</p>
  <input is="child-databinding" />
  <span>{{myresult}} a</span>
  <span>{{myresult}} b</span>
  <span>{{myresult}} 3rd span</span>
  <div>{{myresult2}}</div>
`

class ParentDataBinding extends HTMLElement {
    myresult = 'test1';
    myresult2 = 'This is a test';
    constructor() {
      super();
      this.attachShadow({mode: 'open'})
    }

    addBindAttr(refName) {
      const elements = ['div', 'span'];
      elements.forEach(el1 => {
        this.shadowRoot.querySelectorAll(el1).forEach(el => {
          if (el.textContent.includes(refName)) {
            el.setAttribute('data-bind', refName);
          }
        })
      })
    }

    interpolateInitial(refName, refData) {
      this.shadowRoot.querySelectorAll(`[data-bind="${refName}"]`).forEach(el => {
        console.log(`[data-bind="${refName}"]`,  refData, refName);
        el.innerHTML = el.innerHTML.replaceAll(`{{${refName}}}`, `${refData}<!--{{${refName}}}-->`)
        console.log(el.innerHTML)
      })
    }

    interpolateWhenEvent(refName, oldVal, newVal) {
      this.shadowRoot.querySelectorAll(`[data-bind="${refName}"]`).forEach(el => {
        el.innerHTML = el.innerHTML.replaceAll(`${oldVal}<!--{{${refName}}}-->`, `${newVal}<!--{{${refName}}}-->`)
      })
    }

    binding(refName, refData) {
      this.addBindAttr(refName);
      this.interpolateInitial(refName, refData);

      this.shadowRoot.addEventListener('change1', e => {
          //this.shadowRoot.querySelector('[data-bind="child"]').value = e.target.value;
          //this.shadowRoot.querySelector('[data-bind="myresult"]').textContent = e.target.value;

          this.interpolateWhenEvent(
            refName,
            refData,
            e.detail
          )
          refData = e.detail;
      })
    }
    

    connectedCallback() {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      
      //  trigger from child
      //this.shadowRoot.addEventListener('change1', e => {
      //    this.myresult = e.detail;
      //    this.shadowRoot.querySelector('[data-bind="myinput"]').textContent = this.myresult;
      //    this.myinput = this.myresult;
      //})

      this.binding(
        'myresult',
        this.myresult
      );
      
      this.binding(
        'myresult2',
        this.myresult2
      );

    }

}

customElements.define('parent-databinding', ParentDataBinding);